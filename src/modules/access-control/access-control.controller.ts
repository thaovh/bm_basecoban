import { Controller, Get, Query, Logger, UseGuards, Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

import { GetAttendanceEventsDto } from './application/queries/dto/get-attendance-events.dto';
import { GetAttendanceEventsQuery } from './application/queries/get-attendance-events.query';
import { ResponseBuilder, HTTP_STATUS } from '../../common/dtos/base-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { IAccessControlService } from './domain/access-control.interface';

@ApiTags('Access Control')
@Controller('api/v1/access-control')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AccessControlController {
    private readonly logger = new Logger(AccessControlController.name);

    constructor(
        private readonly queryBus: QueryBus,
        @Inject('IAccessControlService')
        private readonly accessControlService: IAccessControlService,
    ) { }

    @Get('attendance-events')
    @ApiOperation({
        summary: 'Get attendance events from Access Control system',
        description: 'Retrieve attendance/access control events for a specific employee within a time range'
    })
    @ApiResponse({
        status: 200,
        description: 'Attendance events retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                status_code: { type: 'number' },
                data: {
                    type: 'object',
                    properties: {
                        searchID: { type: 'string' },
                        totalMatches: { type: 'number' },
                        responseStatusStrg: { type: 'string' },
                        numOfMatches: { type: 'number' },
                        InfoList: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    major: { type: 'number' },
                                    minor: { type: 'number' },
                                    time: { type: 'string' },
                                    cardNo: { type: 'string' },
                                    name: { type: 'string' },
                                    employeeNoString: { type: 'string' },
                                    pictureURL: { type: 'string' },
                                    cardReaderNo: { type: 'number' },
                                    doorNo: { type: 'number' },
                                    userType: { type: 'string' },
                                    currentVerifyMode: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid parameters' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid JWT token' })
    @ApiResponse({ status: 500, description: 'Access Control system error' })
    @ApiQuery({
        name: 'employeeNoString',
        description: 'Employee number string',
        example: '1844',
        required: true
    })
    @ApiQuery({
        name: 'startTime',
        description: 'Start time in ISO format',
        example: '2025-10-01T00:00:00+07:00',
        required: true
    })
    @ApiQuery({
        name: 'endTime',
        description: 'End time in ISO format',
        example: '2025-10-15T23:59:59+07:00',
        required: true
    })
    @ApiQuery({
        name: 'maxResults',
        description: 'Maximum number of results',
        example: 30,
        required: false
    })
    @ApiQuery({
        name: 'searchResultPosition',
        description: 'Search result position for pagination',
        example: 0,
        required: false
    })
    async getAttendanceEvents(@Query() params: GetAttendanceEventsDto) {
        this.logger.log(`Getting attendance events for employee: ${params.employeeNoString}`);

        const result = await this.queryBus.execute(new GetAttendanceEventsQuery(params));

        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }
}
