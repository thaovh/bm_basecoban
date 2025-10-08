import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HisToken } from '../../domain/his-token.entity';
import { IHisTokenRepository, IHisIntegrationService, HisLoginResponse } from '../../domain/his-integration.interface';
import { HisHttpClientService } from '../../infrastructure/http/his-http-client.service';
import { User } from '../../../user/domain/user.entity';
import { IUserRepository } from '../../../user/domain/user.interface';

@Injectable()
export class HisIntegrationService implements IHisIntegrationService {
    private readonly logger = new Logger(HisIntegrationService.name);
    private readonly tokenRefreshThreshold: number;

    constructor(
        @Inject('IHisTokenRepository')
        private readonly hisTokenRepository: IHisTokenRepository,
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        private readonly hisHttpClient: HisHttpClientService,
        private readonly configService: ConfigService,
    ) {
        this.tokenRefreshThreshold = this.configService.get<number>('HIS_TOKEN_REFRESH_THRESHOLD', 5); // 5 minutes
    }

    async loginToHISWithCurrentUser(currentUserId: string, currentUsername?: string): Promise<HisToken> {
        try {
            this.logger.log(`Logging in to HIS for current user: ${currentUserId}`);

            // Get current user from database
            const currentUser = await this.userRepository.findById(currentUserId);
            if (!currentUser) {
                throw new HttpException('Current user not found', HttpStatus.NOT_FOUND);
            }

            // Check if user has HIS credentials configured
            if (!currentUser.hasHisCredentials()) {
                throw new HttpException(
                    `User '${currentUser.username}' does not have HIS credentials configured. Please configure hisUsername and hisPassword.`, 
                    HttpStatus.BAD_REQUEST
                );
            }

            // Get HIS credentials from user
            const credentials = currentUser.getHisCredentials();
            if (!credentials) {
                throw new HttpException('Failed to get HIS credentials from user', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const hisUsername = credentials.username;
            const hisPassword = credentials.password;

            this.logger.log(`Using HIS credentials for user: ${hisUsername} (from app user: ${currentUser.username})`);

            // Call HIS login API
            const loginResponse: HisLoginResponse = await this.hisHttpClient.loginToHIS(hisUsername, hisPassword);

            // Check if user already has an active token
            const existingToken = await this.hisTokenRepository.findActiveTokenByUser(hisUsername);
            if (existingToken) {
                // Deactivate existing token
                existingToken.deactivate();
                await this.hisTokenRepository.save(existingToken);
            }

            // Create new token entity
            const hisToken = new HisToken();
            hisToken.tokenCode = loginResponse.TokenCode;
            hisToken.renewCode = loginResponse.RenewCode;
            hisToken.loginTime = new Date(loginResponse.LoginTime);
            hisToken.expireTime = new Date(loginResponse.ExpireTime);
            hisToken.loginAddress = loginResponse.LoginAddress;
            hisToken.userLoginName = loginResponse.User.LoginName;
            hisToken.userName = loginResponse.User.UserName;
            hisToken.userEmail = loginResponse.User.Email;
            hisToken.userMobile = loginResponse.User.Mobile;
            hisToken.userGCode = loginResponse.User.GCode;
            hisToken.applicationCode = loginResponse.User.ApplicationCode;
            hisToken.roleDatas = loginResponse.RoleDatas ? JSON.stringify(loginResponse.RoleDatas) : null;
            hisToken.isActiveFlag = 1;
            hisToken.createdBy = currentUser.username; // Use actual username instead of 'system'

            const savedToken = await this.hisTokenRepository.save(hisToken);
            this.logger.log(`Successfully logged in to HIS and saved token for user: ${hisUsername} (app user: ${currentUser.username})`);

            return savedToken;
        } catch (error) {
            this.logger.error(`Failed to login to HIS for current user: ${currentUserId}`, error);
            throw error;
        }
    }

    async loginToHIS(username?: string, password?: string, currentUserId?: string): Promise<HisToken> {
        try {
            let hisUsername = username;
            let hisPassword = password;

            // If username/password not provided, get from current user
            if (!hisUsername || !hisPassword) {
                if (!currentUserId) {
                    throw new HttpException('User ID is required when HIS credentials are not provided', HttpStatus.BAD_REQUEST);
                }

                const currentUser = await this.userRepository.findById(currentUserId);
                if (!currentUser) {
                    throw new HttpException('Current user not found', HttpStatus.NOT_FOUND);
                }

                if (!currentUser.hasHisCredentials()) {
                    throw new HttpException('Current user does not have HIS credentials configured', HttpStatus.BAD_REQUEST);
                }

                const credentials = currentUser.getHisCredentials();
                hisUsername = credentials!.username;
                hisPassword = credentials!.password;
            }

            this.logger.log(`Logging in to HIS for user: ${hisUsername}`);

            // Call HIS login API
            const loginResponse: HisLoginResponse = await this.hisHttpClient.loginToHIS(hisUsername, hisPassword);

            // Check if user already has an active token
            const existingToken = await this.hisTokenRepository.findActiveTokenByUser(hisUsername);
            if (existingToken) {
                // Deactivate existing token
                existingToken.deactivate();
                await this.hisTokenRepository.save(existingToken);
            }

            // Create new token entity
            const hisToken = new HisToken();
            hisToken.tokenCode = loginResponse.TokenCode;
            hisToken.renewCode = loginResponse.RenewCode;
            hisToken.loginTime = new Date(loginResponse.LoginTime);
            hisToken.expireTime = new Date(loginResponse.ExpireTime);
            hisToken.loginAddress = loginResponse.LoginAddress;
            hisToken.userLoginName = loginResponse.User.LoginName;
            hisToken.userName = loginResponse.User.UserName;
            hisToken.userEmail = loginResponse.User.Email;
            hisToken.userMobile = loginResponse.User.Mobile;
            hisToken.userGCode = loginResponse.User.GCode;
            hisToken.applicationCode = loginResponse.User.ApplicationCode;
            hisToken.roleDatas = loginResponse.RoleDatas ? JSON.stringify(loginResponse.RoleDatas) : null;
            hisToken.isActiveFlag = 1;
            hisToken.createdBy = 'system';

            const savedToken = await this.hisTokenRepository.save(hisToken);
            this.logger.log(`Successfully logged in to HIS and saved token for user: ${hisUsername}`);

            return savedToken;
        } catch (error) {
            this.logger.error(`Failed to login to HIS for user: ${username || 'unknown'}`, error);
            throw error;
        }
    }

    async renewToken(renewCode: string): Promise<HisToken> {
        try {
            this.logger.log(`Renewing HIS token`);

            // Call HIS renew API
            const renewResponse: HisLoginResponse = await this.hisHttpClient.renewToken(renewCode);

            // Find existing token by renew code
            const existingToken = await this.hisTokenRepository.findByTokenCode(renewResponse.TokenCode);
            if (!existingToken) {
                throw new HttpException('Token not found for renewal', HttpStatus.NOT_FOUND);
            }

            // Update token data
            existingToken.updateTokenData(
                renewResponse.TokenCode,
                renewResponse.RenewCode,
                new Date(renewResponse.ExpireTime)
            );
            existingToken.updatedBy = 'system';

            const updatedToken = await this.hisTokenRepository.save(existingToken);
            this.logger.log(`Successfully renewed HIS token for user: ${updatedToken.userLoginName}`);

            return updatedToken;
        } catch (error) {
            this.logger.error(`Failed to renew HIS token`, error);
            throw error;
        }
    }

    async getValidToken(userLoginName?: string): Promise<HisToken> {
        try {
            let token: HisToken | null = null;

            if (userLoginName) {
                // Get token for specific user
                token = await this.hisTokenRepository.findActiveTokenByUser(userLoginName);
            } else {
                // Get any active token (for system operations)
                const activeTokens = await this.hisTokenRepository.findAllActiveTokens();
                token = activeTokens.length > 0 ? activeTokens[0] : null;
            }

            if (!token) {
                throw new HttpException('No active HIS token found', HttpStatus.UNAUTHORIZED);
            }

            // Check if token is expired
            if (token.isTokenExpired()) {
                this.logger.warn(`HIS token is expired for user: ${token.userLoginName}`);
                throw new HttpException('HIS token is expired', HttpStatus.UNAUTHORIZED);
            }

            // Check if token needs refresh
            if (token.isTokenExpiringSoon(this.tokenRefreshThreshold)) {
                this.logger.log(`HIS token is expiring soon for user: ${token.userLoginName}, attempting to refresh`);
                return await this.refreshTokenIfNeeded(userLoginName);
            }

            return token;
        } catch (error) {
            this.logger.error(`Failed to get valid HIS token for user: ${userLoginName}`, error);
            throw error;
        }
    }

    async refreshTokenIfNeeded(userLoginName?: string): Promise<HisToken> {
        try {
            let token: HisToken | null = null;

            if (userLoginName) {
                token = await this.hisTokenRepository.findActiveTokenByUser(userLoginName);
            } else {
                const activeTokens = await this.hisTokenRepository.findAllActiveTokens();
                token = activeTokens.length > 0 ? activeTokens[0] : null;
            }

            if (!token) {
                throw new HttpException('No active HIS token found for refresh', HttpStatus.UNAUTHORIZED);
            }

            // Try to renew the token
            try {
                return await this.renewToken(token.renewCode);
            } catch (renewError) {
                this.logger.error(`Failed to renew token for user: ${token.userLoginName}`, renewError);
                // If renewal fails, deactivate the token
                token.deactivate();
                await this.hisTokenRepository.save(token);
                throw new HttpException('Token renewal failed', HttpStatus.UNAUTHORIZED);
            }
        } catch (error) {
            this.logger.error(`Failed to refresh HIS token for user: ${userLoginName}`, error);
            throw error;
        }
    }

    async callHISAPI(endpoint: string, data?: any, userLoginName?: string): Promise<any> {
        try {
            this.logger.log(`Calling HIS API: ${endpoint} for user: ${userLoginName || 'system'}`);

            // Get valid token
            const token = await this.getValidToken(userLoginName);

            // Make API call with token
            const result = await this.hisHttpClient.callHISAPI(endpoint, data, token.tokenCode);

            this.logger.log(`Successfully called HIS API: ${endpoint}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to call HIS API: ${endpoint}`, error);
            throw error;
        }
    }

    async logoutFromHIS(userLoginName: string): Promise<void> {
        try {
            this.logger.log(`Logging out from HIS for user: ${userLoginName}`);

            const token = await this.hisTokenRepository.findActiveTokenByUser(userLoginName);
            if (token) {
                token.deactivate();
                await this.hisTokenRepository.save(token);
                this.logger.log(`Successfully logged out from HIS for user: ${userLoginName}`);
            }
        } catch (error) {
            this.logger.error(`Failed to logout from HIS for user: ${userLoginName}`, error);
            throw error;
        }
    }

    async getCurrentUserHISUsername(currentUserId: string): Promise<string> {
        try {
            const currentUser = await this.userRepository.findById(currentUserId);
            if (!currentUser) {
                throw new HttpException('Current user not found', HttpStatus.NOT_FOUND);
            }

            if (!currentUser.hasHisCredentials()) {
                throw new HttpException(
                    `User '${currentUser.username}' does not have HIS credentials configured. Please configure hisUsername and hisPassword.`, 
                    HttpStatus.BAD_REQUEST
                );
            }

            const credentials = currentUser.getHisCredentials();
            if (!credentials) {
                throw new HttpException('Failed to get HIS credentials from user', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            return credentials.username;
        } catch (error) {
            this.logger.error(`Failed to get HIS username for current user: ${currentUserId}`, error);
            throw error;
        }
    }

    async cleanupExpiredTokens(): Promise<void> {
        try {
            this.logger.log('Cleaning up expired HIS tokens');

            await this.hisTokenRepository.cleanupExpiredTokens();

            this.logger.log('Successfully cleaned up expired HIS tokens');
        } catch (error) {
            this.logger.error('Failed to cleanup expired HIS tokens', error);
            throw error;
        }
    }
}
