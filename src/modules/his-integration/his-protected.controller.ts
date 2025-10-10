import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { DualAuthGuard } from '../../common/guards/dual-auth.guard';
import { HisAuth } from '../../common/decorators/his-auth.decorator';
import { ResponseBuilder } from '../../common/dtos/base-response.dto';

@ApiTags('HIS Protected Endpoints')
@Controller('api/v1/his-protected')
@UseGuards(DualAuthGuard)
@ApiBearerAuth()
export class HisProtectedController {
    
    @Get('profile')
    @HisAuth() // This endpoint requires HIS authentication
    @ApiOperation({ summary: 'Get user profile using HIS token authentication' })
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
    @ApiResponse({ status: 401, description: 'HIS token authentication failed' })
    async getUserProfile(@Request() req: any) {
        const user = req.user;
        
        return ResponseBuilder.success({
            message: 'Profile accessed using HIS token authentication',
            user: {
                id: user.sub,
                username: user.username,
                email: user.email,
                role: user.role,
                hisUsername: user.hisUsername,
            },
            hisToken: {
                tokenCode: user.hisToken.tokenCode,
                userLoginName: user.hisToken.userLoginName,
                userName: user.hisToken.userName,
                expireTime: user.hisToken.expireTime,
                minutesUntilExpire: user.hisToken.getMinutesUntilExpire(),
            }
        });
    }

    @Get('data')
    @HisAuth() // This endpoint requires HIS authentication
    @ApiOperation({ summary: 'Get protected data using HIS token authentication' })
    @ApiResponse({ status: 200, description: 'Data retrieved successfully' })
    @ApiResponse({ status: 401, description: 'HIS token authentication failed' })
    async getProtectedData(@Request() req: any) {
        const user = req.user;
        
        return ResponseBuilder.success({
            message: 'Protected data accessed using HIS token',
            data: {
                timestamp: new Date().toISOString(),
                accessedBy: user.username,
                hisUser: user.hisUsername,
                permissions: user.role,
            }
        });
    }

    @Post('action')
    @HisAuth() // This endpoint requires HIS authentication
    @ApiOperation({ summary: 'Perform action using HIS token authentication' })
    @ApiResponse({ status: 200, description: 'Action performed successfully' })
    @ApiResponse({ status: 401, description: 'HIS token authentication failed' })
    async performAction(@Request() req: any) {
        const user = req.user;
        
        return ResponseBuilder.success({
            message: 'Action performed using HIS token authentication',
            result: {
                action: 'sample_action',
                performedBy: user.username,
                hisUser: user.hisUsername,
                timestamp: new Date().toISOString(),
                status: 'completed'
            }
        });
    }

    @Get('jwt-only')
    // No @HisAuth() decorator - this endpoint uses JWT authentication (default)
    @ApiOperation({ summary: 'Get data using JWT authentication (default)' })
    @ApiResponse({ status: 200, description: 'Data retrieved successfully' })
    @ApiResponse({ status: 401, description: 'JWT authentication failed' })
    async getJwtOnlyData(@Request() req: any) {
        const user = req.user;
        
        return ResponseBuilder.success({
            message: 'Data accessed using JWT authentication',
            user: {
                id: user.sub,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    }
}
