import { Controller, Post, Body, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { LoginDto } from './application/commands/dto/login.dto';
import { LoginCommand } from './application/commands/login.command';
import { ResponseBuilder, HTTP_STATUS } from '../../common/dtos/base-response.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Authentication')
@Controller('api/v1')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly commandBus: CommandBus) { }

    @Post('auth/login')
    @Public()
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async login(@Body() loginDto: LoginDto) {
        this.logger.log(`Login attempt for username/email: ${loginDto.usernameOrEmail}`);

        const result = await this.commandBus.execute(new LoginCommand(loginDto));

        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }

    @Post('auth/refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refreshToken(@Body() refreshTokenDto: { refreshToken: string }) {
        this.logger.log('Token refresh attempt');

        // TODO: Implement refresh token logic
        return ResponseBuilder.success({ message: 'Token refresh not implemented yet' }, HTTP_STATUS.OK);
    }

    @Post('auth/logout')
    @ApiOperation({ summary: 'User logout' })
    @ApiResponse({ status: 200, description: 'Logout successful' })
    async logout() {
        this.logger.log('User logout');

        // TODO: Implement logout logic (token blacklisting, etc.)
        return ResponseBuilder.success({ message: 'Logout successful' }, HTTP_STATUS.OK);
    }
}
