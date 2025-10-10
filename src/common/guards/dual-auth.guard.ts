import { Injectable, ExecutionContext, UnauthorizedException, Logger, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { HisIntegrationService } from '../../modules/his-integration/application/services/his-integration.service';
import { IUserRepository } from '../../modules/user/domain/user.interface';

@Injectable()
export class DualAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(DualAuthGuard.name);

    constructor(
        private reflector: Reflector,
        private readonly hisIntegrationService: HisIntegrationService,
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Check if route is marked as public
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        // Check if route requires HIS authentication
        const requiresHisAuth = this.reflector.getAllAndOverride<boolean>('hisAuth', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (requiresHisAuth) {
            return this.validateHisToken(context);
        }

        // Default to JWT authentication
        return super.canActivate(context) as Promise<boolean>;
    }

    private async validateHisToken(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const hisToken = this.extractHisTokenFromHeader(request);

        if (!hisToken) {
            throw new UnauthorizedException('HIS token is required');
        }

        try {
            // Validate HIS token
            const hisTokenEntity = await this.hisIntegrationService.getValidToken();
            
            if (!hisTokenEntity || hisTokenEntity.tokenCode !== hisToken) {
                throw new UnauthorizedException('Invalid HIS token');
            }

            if (hisTokenEntity.isTokenExpired()) {
                throw new UnauthorizedException('HIS token has expired');
            }

            // Find user by HIS username
            const user = await this.userRepository.findByUsername(hisTokenEntity.userLoginName);
            if (!user) {
                // If user not found by HIS username, try to find by hisUsername field
                const users = await this.userRepository.findAll();
                const userWithHisCredentials = users.find(u => u.hisUsername === hisTokenEntity.userLoginName);
                
                if (!userWithHisCredentials) {
                    throw new UnauthorizedException(`User not found for HIS username: ${hisTokenEntity.userLoginName}`);
                }

                // Attach user info to request
                request.user = {
                    sub: userWithHisCredentials.id,
                    username: userWithHisCredentials.username,
                    email: userWithHisCredentials.email,
                    role: userWithHisCredentials.role,
                    hisUsername: hisTokenEntity.userLoginName,
                    hisToken: hisTokenEntity,
                };
            } else {
                // Attach user info to request
                request.user = {
                    sub: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    hisUsername: hisTokenEntity.userLoginName,
                    hisToken: hisTokenEntity,
                };
            }

            this.logger.debug(`HIS authentication successful for user: ${request.user.username} (HIS: ${hisTokenEntity.userLoginName})`);
            return true;

        } catch (error) {
            this.logger.error(`HIS authentication failed: ${error.message}`);
            throw new UnauthorizedException(`HIS authentication failed: ${error.message}`);
        }
    }

    private extractHisTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            // Provide more specific error messages
            if (info?.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Access token has expired');
            } else if (info?.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Invalid access token format');
            } else if (info?.name === 'NotBeforeError') {
                throw new UnauthorizedException('Access token not active yet');
            } else if (!info && !user) {
                throw new UnauthorizedException('Access token is required');
            } else {
                throw err || new UnauthorizedException('Access token is invalid or expired');
            }
        }
        return user;
    }
}
