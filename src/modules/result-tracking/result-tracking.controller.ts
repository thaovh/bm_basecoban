import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

import {
    CreateResultTrackingDto,
    UpdateResultTrackingDto,
    GetResultTrackingsDto,
    CheckInTrackingDto,
    CheckOutTrackingDto
} from './domain/result-tracking.dto';

import { CreateResultTrackingCommand } from './application/commands/create-result-tracking.command';
import { UpdateResultTrackingCommand } from './application/commands/update-result-tracking.command';
import { DeleteResultTrackingCommand } from './application/commands/delete-result-tracking.command';
import { CheckInTrackingCommand } from './application/commands/check-in-tracking.command';
import { CheckOutTrackingCommand } from './application/commands/check-out-tracking.command';

import { GetResultTrackingByIdQuery } from './application/queries/get-result-tracking-by-id.query';
import { GetResultTrackingsByServiceRequestQuery } from './application/queries/get-result-trackings-by-service-request.query';
import { GetResultTrackingsQuery } from './application/queries/get-result-trackings.query';
import { GetCurrentTrackingQuery } from './application/queries/get-current-tracking.query';
import { GetTrackingStatisticsQuery } from './application/queries/get-tracking-statistics.query';

@ApiTags('Result Tracking')
@Controller('api/v1/result-trackings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ResultTrackingController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create new result tracking' })
    @ApiResponse({ status: 201, description: 'Result tracking created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 409, description: 'Service request already has active tracking' })
    async createResultTracking(@Body() createResultTrackingDto: CreateResultTrackingDto) {
        return this.commandBus.execute(new CreateResultTrackingCommand(createResultTrackingDto));
    }

    @Post('check-in')
    @ApiOperation({ summary: 'Check in to start tracking' })
    @ApiResponse({ status: 201, description: 'Check-in successful' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 409, description: 'Service request already has active tracking' })
    async checkInTracking(@Body() checkInTrackingDto: CheckInTrackingDto) {
        return this.commandBus.execute(new CheckInTrackingCommand(checkInTrackingDto));
    }

    @Put(':id/check-out')
    @ApiOperation({ summary: 'Check out to complete tracking' })
    @ApiParam({ name: 'id', description: 'Result tracking ID' })
    @ApiResponse({ status: 200, description: 'Check-out successful' })
    @ApiResponse({ status: 400, description: 'Bad request or already checked out' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Result tracking not found' })
    async checkOutTracking(
        @Param('id') id: string,
        @Body() checkOutTrackingDto: CheckOutTrackingDto,
    ) {
        return this.commandBus.execute(new CheckOutTrackingCommand(id, checkOutTrackingDto));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get result tracking by ID' })
    @ApiParam({ name: 'id', description: 'Result tracking ID' })
    @ApiResponse({ status: 200, description: 'Result tracking found' })
    @ApiResponse({ status: 404, description: 'Result tracking not found' })
    async getResultTrackingById(@Param('id') id: string) {
        return this.queryBus.execute(new GetResultTrackingByIdQuery(id));
    }

    @Get('service-request/:serviceRequestId')
    @ApiOperation({ summary: 'Get result trackings by service request ID' })
    @ApiParam({ name: 'serviceRequestId', description: 'Service request ID' })
    @ApiResponse({ status: 200, description: 'Result trackings found' })
    async getResultTrackingsByServiceRequest(@Param('serviceRequestId') serviceRequestId: string) {
        return this.queryBus.execute(new GetResultTrackingsByServiceRequestQuery(serviceRequestId));
    }

    @Get('service-request/:serviceRequestId/current')
    @ApiOperation({ summary: 'Get current active tracking for service request' })
    @ApiParam({ name: 'serviceRequestId', description: 'Service request ID' })
    @ApiResponse({ status: 200, description: 'Current tracking found or null' })
    async getCurrentTracking(@Param('serviceRequestId') serviceRequestId: string) {
        return this.queryBus.execute(new GetCurrentTrackingQuery(serviceRequestId));
    }

    @Get()
    @ApiOperation({ summary: 'Get result trackings list' })
    @ApiQuery({ name: 'limit', required: false, description: 'Page limit' })
    @ApiQuery({ name: 'offset', required: false, description: 'Page offset' })
    @ApiQuery({ name: 'serviceRequestId', required: false, description: 'Filter by service request ID' })
    @ApiQuery({ name: 'resultStatusId', required: false, description: 'Filter by result status ID' })
    @ApiQuery({ name: 'roomId', required: false, description: 'Filter by room ID' })
    @ApiQuery({ name: 'search', required: false, description: 'Search term' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Start date filter' })
    @ApiQuery({ name: 'endDate', required: false, description: 'End date filter' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Show only active trackings' })
    @ApiQuery({ name: 'isOverdue', required: false, description: 'Show only overdue trackings' })
    @ApiResponse({ status: 200, description: 'Result trackings list' })
    async getResultTrackings(@Query() query: GetResultTrackingsDto) {
        return this.queryBus.execute(new GetResultTrackingsQuery(query));
    }

    @Get('statistics')
    @ApiOperation({ summary: 'Get tracking statistics' })
    @ApiQuery({ name: 'serviceRequestId', required: false, description: 'Filter by service request ID' })
    @ApiQuery({ name: 'roomId', required: false, description: 'Filter by room ID' })
    @ApiQuery({ name: 'resultStatusId', required: false, description: 'Filter by result status ID' })
    @ApiResponse({ status: 200, description: 'Tracking statistics' })
    async getTrackingStatistics(
        @Query('serviceRequestId') serviceRequestId?: string,
        @Query('roomId') roomId?: string,
        @Query('resultStatusId') resultStatusId?: string,
    ) {
        return this.queryBus.execute(new GetTrackingStatisticsQuery(serviceRequestId, roomId, resultStatusId));
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update result tracking' })
    @ApiParam({ name: 'id', description: 'Result tracking ID' })
    @ApiResponse({ status: 200, description: 'Result tracking updated successfully' })
    @ApiResponse({ status: 404, description: 'Result tracking not found' })
    async updateResultTracking(
        @Param('id') id: string,
        @Body() updateResultTrackingDto: UpdateResultTrackingDto,
    ) {
        return this.commandBus.execute(new UpdateResultTrackingCommand(id, updateResultTrackingDto));
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete result tracking' })
    @ApiParam({ name: 'id', description: 'Result tracking ID' })
    @ApiResponse({ status: 200, description: 'Result tracking deleted successfully' })
    @ApiResponse({ status: 404, description: 'Result tracking not found' })
    async deleteResultTracking(@Param('id') id: string) {
        return this.commandBus.execute(new DeleteResultTrackingCommand(id));
    }
}
