import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Health')
@Controller('api/v1')
export class HealthController {
    @Get('health')
    @Public()
    @ApiOperation({ summary: 'Health check endpoint' })
    @ApiResponse({ status: 200, description: 'Service is healthy' })
    getHealth() {
        return {
            success: true,
            status_code: 200,
            data: {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                service: 'Bach Mai LIS Management System',
                version: '1.0.0',
            },
            meta: {
                timestamp: new Date().toISOString(),
            },
        };
    }

    @Get('ready')
    @Public()
    @ApiOperation({ summary: 'Readiness check endpoint' })
    @ApiResponse({ status: 200, description: 'Service is ready' })
    getReady() {
        return {
            success: true,
            status_code: 200,
            data: {
                status: 'ready',
                timestamp: new Date().toISOString(),
            },
            meta: {
                timestamp: new Date().toISOString(),
            },
        };
    }
}
