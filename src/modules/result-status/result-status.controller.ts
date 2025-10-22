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

import { CreateResultStatusDto, UpdateResultStatusDto, GetResultStatusesDto, SearchResultStatusesDto } from './domain/result-status.dto';

import { CreateResultStatusCommand } from './application/commands/create-result-status.command';
import { UpdateResultStatusCommand } from './application/commands/update-result-status.command';
import { DeleteResultStatusCommand } from './application/commands/delete-result-status.command';

import { GetResultStatusByIdQuery } from './application/queries/get-result-status-by-id.query';
import { GetResultStatusByCodeQuery } from './application/queries/get-result-status-by-code.query';
import { GetResultStatusesQuery } from './application/queries/get-result-statuses.query';
import { SearchResultStatusesQuery } from './application/queries/search-result-statuses.query';

@ApiTags('Result Statuses')
@Controller('api/v1/result-statuses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ResultStatusController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create new result status' })
    @ApiResponse({ status: 201, description: 'Result status created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 409, description: 'Result status code already exists' })
    async createResultStatus(@Body() createResultStatusDto: CreateResultStatusDto) {
        return this.commandBus.execute(new CreateResultStatusCommand(createResultStatusDto));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get result status by ID' })
    @ApiParam({ name: 'id', description: 'Result status ID' })
    @ApiResponse({ status: 200, description: 'Result status found' })
    @ApiResponse({ status: 404, description: 'Result status not found' })
    async getResultStatusById(@Param('id') id: string) {
        return this.queryBus.execute(new GetResultStatusByIdQuery(id));
    }

    @Get('code/:statusCode')
    @ApiOperation({ summary: 'Get result status by code' })
    @ApiParam({ name: 'statusCode', description: 'Result status code' })
    @ApiResponse({ status: 200, description: 'Result status found' })
    @ApiResponse({ status: 404, description: 'Result status not found' })
    async getResultStatusByCode(@Param('statusCode') statusCode: string) {
        return this.queryBus.execute(new GetResultStatusByCodeQuery(statusCode));
    }

    @Get()
    @ApiOperation({ summary: 'Get result statuses list' })
    @ApiQuery({ name: 'limit', required: false, description: 'Page limit' })
    @ApiQuery({ name: 'offset', required: false, description: 'Page offset' })
    @ApiQuery({ name: 'search', required: false, description: 'Search term' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
    @ApiQuery({ name: 'sortByOrder', required: false, description: 'Sort by order number' })
    @ApiResponse({ status: 200, description: 'Result statuses list' })
    async getResultStatuses(@Query() query: GetResultStatusesDto) {
        return this.queryBus.execute(new GetResultStatusesQuery(query));
    }

    @Get('search')
    @ApiOperation({ summary: 'Search result statuses' })
    @ApiQuery({ name: 'searchTerm', required: true, description: 'Search term' })
    @ApiQuery({ name: 'limit', required: false, description: 'Page limit' })
    @ApiQuery({ name: 'offset', required: false, description: 'Page offset' })
    @ApiResponse({ status: 200, description: 'Search results' })
    async searchResultStatuses(@Query() query: SearchResultStatusesDto) {
        return this.queryBus.execute(new SearchResultStatusesQuery(query));
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update result status' })
    @ApiParam({ name: 'id', description: 'Result status ID' })
    @ApiResponse({ status: 200, description: 'Result status updated successfully' })
    @ApiResponse({ status: 404, description: 'Result status not found' })
    @ApiResponse({ status: 409, description: 'Result status code already exists' })
    async updateResultStatus(
        @Param('id') id: string,
        @Body() updateResultStatusDto: UpdateResultStatusDto,
    ) {
        return this.commandBus.execute(new UpdateResultStatusCommand(id, updateResultStatusDto));
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete result status' })
    @ApiParam({ name: 'id', description: 'Result status ID' })
    @ApiResponse({ status: 200, description: 'Result status deleted successfully' })
    @ApiResponse({ status: 404, description: 'Result status not found' })
    async deleteResultStatus(@Param('id') id: string) {
        return this.commandBus.execute(new DeleteResultStatusCommand(id));
    }
}
