import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    HttpStatus,
    Query,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ResponseBuilder } from '../../common/dtos/base-response.dto';

import { HisLoginDto } from './application/commands/dto/his-login.dto';
import { HisApiCallDto } from './application/commands/dto/his-api-call.dto';
import { HisIntegrationService } from './application/services/his-integration.service';

@ApiTags('HIS Integration')
@Controller('api/v1/his-integration')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class HisIntegrationController {
    constructor(
        private readonly hisIntegrationService: HisIntegrationService,
    ) { }

    @Post('login')
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Login to HIS system and get token (uses current user HIS credentials if not provided)' })
    @ApiResponse({ status: 201, description: 'Successfully logged in to HIS' })
    @ApiResponse({ status: 401, description: 'HIS login failed' })
    @ApiResponse({ status: 400, description: 'HIS credentials not configured for current user' })
    async loginToHIS(@Body() hisLoginDto: HisLoginDto, @Request() req: any) {
        const currentUserId = req.user?.sub; // Get current user ID from JWT token
        const token = await this.hisIntegrationService.loginToHIS(
            hisLoginDto.username,
            hisLoginDto.password,
            currentUserId
        );
        return ResponseBuilder.success(token, HttpStatus.CREATED);
    }

    @Post('renew-token')
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Renew HIS token using renew code' })
    @ApiResponse({ status: 200, description: 'Token renewed successfully' })
    @ApiResponse({ status: 401, description: 'Token renewal failed' })
    async renewToken(@Body('renewCode') renewCode: string) {
        const token = await this.hisIntegrationService.renewToken(renewCode);
        return ResponseBuilder.success(token);
    }

    @Get('token')
    @Roles('admin', 'manager', 'user')
    @ApiOperation({ summary: 'Get valid HIS token' })
    @ApiResponse({ status: 200, description: 'Token retrieved successfully' })
    @ApiResponse({ status: 401, description: 'No valid token found' })
    async getValidToken(@Query('username') username?: string) {
        const token = await this.hisIntegrationService.getValidToken(username);
        return ResponseBuilder.success(token);
    }

    @Post('refresh-token')
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Refresh HIS token if needed' })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
    @ApiResponse({ status: 401, description: 'Token refresh failed' })
    async refreshToken(@Query('username') username?: string) {
        const token = await this.hisIntegrationService.refreshTokenIfNeeded(username);
        return ResponseBuilder.success(token);
    }

    @Post('call-api')
    @Roles('admin', 'manager', 'user')
    @ApiOperation({ summary: 'Call HIS API with automatic token management' })
    @ApiResponse({ status: 200, description: 'API called successfully' })
    @ApiResponse({ status: 401, description: 'Authentication failed' })
    @ApiResponse({ status: 400, description: 'API call failed' })
    async callHISAPI(@Body() hisApiCallDto: HisApiCallDto) {
        const result = await this.hisIntegrationService.callHISAPI(
            hisApiCallDto.endpoint,
            hisApiCallDto.data,
            hisApiCallDto.username
        );
        return ResponseBuilder.success(result);
    }

    @Get('user-info/:username')
    @Roles('admin', 'manager', 'user')
    @ApiOperation({ summary: 'Get HIS user information' })
    @ApiResponse({ status: 200, description: 'User info retrieved successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserInfo(@Param('username') username: string) {
        const token = await this.hisIntegrationService.getValidToken(username);

        const userInfo = {
            loginName: token.userLoginName,
            userName: token.userName,
            email: token.userEmail,
            mobile: token.userMobile,
            gCode: token.userGCode,
            applicationCode: token.applicationCode,
            roles: token.parseRoleDatas(),
            loginTime: token.loginTime,
            expireTime: token.expireTime,
            minutesUntilExpire: token.getMinutesUntilExpire(),
        };

        return ResponseBuilder.success(userInfo);
    }

    @Post('logout/:username')
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Logout from HIS system' })
    @ApiResponse({ status: 200, description: 'Successfully logged out from HIS' })
    async logoutFromHIS(@Param('username') username: string) {
        await this.hisIntegrationService.logoutFromHIS(username);
        return ResponseBuilder.success({ message: 'Successfully logged out from HIS' });
    }

    @Post('cleanup-expired-tokens')
    @Roles('admin')
    @ApiOperation({ summary: 'Cleanup expired HIS tokens' })
    @ApiResponse({ status: 200, description: 'Expired tokens cleaned up successfully' })
    async cleanupExpiredTokens() {
        await this.hisIntegrationService.cleanupExpiredTokens();
        return ResponseBuilder.success({ message: 'Expired tokens cleaned up successfully' });
    }

    @Get('token-status')
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Get HIS token status information' })
    @ApiResponse({ status: 200, description: 'Token status retrieved successfully' })
    async getTokenStatus(@Query('username') username?: string) {
        try {
            const token = await this.hisIntegrationService.getValidToken(username);

            const status = {
                isValid: true,
                isExpired: token.isTokenExpired(),
                isExpiringSoon: token.isTokenExpiringSoon(),
                minutesUntilExpire: token.getMinutesUntilExpire(),
                userLoginName: token.userLoginName,
                userName: token.userName,
                loginTime: token.loginTime,
                expireTime: token.expireTime,
            };

            return ResponseBuilder.success(status);
        } catch (error) {
            const status = {
                isValid: false,
                isExpired: true,
                isExpiringSoon: false,
                minutesUntilExpire: 0,
                error: (error as Error).message,
            };

            return ResponseBuilder.success(status);
        }
    }
}
