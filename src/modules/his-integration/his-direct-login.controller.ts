import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseBuilder } from '../../common/dtos/base-response.dto';
import { HisIntegrationService } from './application/services/his-integration.service';

@ApiTags('HIS Direct Login')
@Controller('api/v1/his-direct-login')
export class HisDirectLoginController {
    constructor(
        private readonly hisIntegrationService: HisIntegrationService,
    ) {}

    @Post('login')
    @Public() // Không cần JWT authentication
    @ApiOperation({ summary: 'Direct login to HIS system with username/password' })
    @ApiResponse({ status: 201, description: 'Successfully logged in to HIS' })
    @ApiResponse({ status: 401, description: 'HIS login failed' })
    @ApiResponse({ status: 400, description: 'Invalid credentials' })
    async directLoginToHIS(@Body() loginDto: { username: string; password: string }) {
        try {
            const { username, password } = loginDto;

            if (!username || !password) {
                throw new HttpException('Username and password are required', HttpStatus.BAD_REQUEST);
            }

            // Login directly to HIS with provided credentials
            const hisToken = await this.hisIntegrationService.loginToHISDirect(username, password);

            return ResponseBuilder.success({
                message: 'Successfully logged in to HIS system',
                hisToken: {
                    tokenCode: hisToken.tokenCode,
                    userLoginName: hisToken.userLoginName,
                    userName: hisToken.userName,
                    userEmail: hisToken.userEmail,
                    userMobile: hisToken.userMobile,
                    userGCode: hisToken.userGCode,
                    applicationCode: hisToken.applicationCode,
                    loginTime: hisToken.loginTime,
                    expireTime: hisToken.expireTime,
                    minutesUntilExpire: hisToken.getMinutesUntilExpire(),
                    roles: hisToken.parseRoleDatas(),
                },
                // Trả về HIS token để client có thể dùng làm Bearer token
                accessToken: hisToken.tokenCode,
                tokenType: 'Bearer',
                expiresIn: hisToken.getMinutesUntilExpire() * 60, // seconds
            }, HttpStatus.CREATED);

        } catch (error) {
            throw new HttpException(
                `HIS login failed: ${(error as Error).message}`,
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    @Post('validate-token')
    @Public() // Không cần JWT authentication
    @ApiOperation({ summary: 'Validate HIS token and get user info' })
    @ApiResponse({ status: 200, description: 'Token is valid' })
    @ApiResponse({ status: 401, description: 'Token is invalid or expired' })
    async validateHisToken(@Body() body: { token: string }) {
        try {
            const { token } = body;

            if (!token) {
                throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
            }

            // Validate HIS token
            const hisToken = await this.hisIntegrationService.getValidToken();

            if (!hisToken || hisToken.tokenCode !== token) {
                throw new HttpException('Invalid HIS token', HttpStatus.UNAUTHORIZED);
            }

            if (hisToken.isTokenExpired()) {
                throw new HttpException('HIS token has expired', HttpStatus.UNAUTHORIZED);
            }

            return ResponseBuilder.success({
                message: 'HIS token is valid',
                user: {
                    loginName: hisToken.userLoginName,
                    userName: hisToken.userName,
                    email: hisToken.userEmail,
                    mobile: hisToken.userMobile,
                    gCode: hisToken.userGCode,
                    applicationCode: hisToken.applicationCode,
                    roles: hisToken.parseRoleDatas(),
                },
                token: {
                    tokenCode: hisToken.tokenCode,
                    loginTime: hisToken.loginTime,
                    expireTime: hisToken.expireTime,
                    minutesUntilExpire: hisToken.getMinutesUntilExpire(),
                    isExpired: hisToken.isTokenExpired(),
                    isExpiringSoon: hisToken.isTokenExpiringSoon(5), // 5 minutes threshold
                }
            });

        } catch (error) {
            throw new HttpException(
                `Token validation failed: ${(error as Error).message}`,
                HttpStatus.UNAUTHORIZED
            );
        }
    }
}
