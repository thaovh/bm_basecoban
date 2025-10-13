import { Controller, Get, Post, Put, Delete, Body, Param, Query, Logger, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

import { CreateServiceGroupDto } from './application/commands/dto/create-service-group.dto';
import { UpdateServiceGroupDto } from './application/commands/dto/update-service-group.dto';
import { GetServiceGroupsDto } from './application/queries/dto/get-service-groups.dto';
import { CreateServiceGroupCommand } from './application/commands/create-service-group.command';
import { UpdateServiceGroupCommand } from './application/commands/update-service-group.command';
import { DeleteServiceGroupCommand } from './application/commands/delete-service-group.command';
import { GetServiceGroupByIdQuery } from './application/queries/get-service-group-by-id.query';
import { GetServiceGroupsQuery } from './application/queries/get-service-groups.query';
import { ResponseBuilder, HTTP_STATUS } from '../../common/dtos/base-response.dto';
import { DualAuthGuard } from '../../common/guards/dual-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { HisAuth } from '../../common/decorators/his-auth.decorator';

@ApiTags('Service Groups')
@Controller('api/v1')
@UseGuards(DualAuthGuard)
@ApiBearerAuth()
export class ServiceGroupController {
    private readonly logger = new Logger(ServiceGroupController.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Get('service-groups')
    @HisAuth() // Cho phép sử dụng HIS token
    @ApiOperation({ summary: 'Get all service groups (supports both JWT and HIS token authentication)' })
    @ApiResponse({ status: 200, description: 'Service groups retrieved successfully' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of items to skip' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
    async getServiceGroups(@Query() getServiceGroupsDto: GetServiceGroupsDto) {
        this.logger.log('Getting service groups list');

        const result = await this.queryBus.execute(new GetServiceGroupsQuery(getServiceGroupsDto));

        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }

    @Get('service-groups/:id')
    @HisAuth() // Cho phép sử dụng HIS token
    @ApiOperation({ summary: 'Get service group by ID (supports both JWT and HIS token authentication)' })
    @ApiResponse({ status: 200, description: 'Service group retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Service group not found' })
    @ApiParam({ name: 'id', description: 'Service Group ID' })
    async getServiceGroupById(@Param('id') id: string) {
        this.logger.log(`Getting service group by id: ${id}`);

        const result = await this.queryBus.execute(new GetServiceGroupByIdQuery(id));

        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }

    @Post('service-groups')
    @ApiOperation({ summary: 'Create new service group' })
    @ApiResponse({ status: 201, description: 'Service group created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Service group code or name already exists' })
    @ApiBearerAuth()
    @UseGuards(RoleGuard)
    @Roles('admin')
    async createServiceGroup(@Body() createServiceGroupDto: CreateServiceGroupDto) {
        this.logger.log(`Creating service group: ${createServiceGroupDto.serviceGroupName}`);

        const result = await this.commandBus.execute(new CreateServiceGroupCommand(createServiceGroupDto));

        return ResponseBuilder.success(result, HTTP_STATUS.CREATED);
    }

    @Put('service-groups/:id')
    @ApiOperation({ summary: 'Update service group' })
    @ApiResponse({ status: 200, description: 'Service group updated successfully' })
    @ApiResponse({ status: 404, description: 'Service group not found' })
    @ApiResponse({ status: 409, description: 'Service group code or name already exists' })
    @ApiParam({ name: 'id', description: 'Service Group ID' })
    @ApiBearerAuth()
    @UseGuards(RoleGuard)
    @Roles('admin')
    async updateServiceGroup(@Param('id') id: string, @Body() updateServiceGroupDto: UpdateServiceGroupDto) {
        this.logger.log(`Updating service group: ${id}`);

        const result = await this.commandBus.execute(new UpdateServiceGroupCommand(id, updateServiceGroupDto));

        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }

    @Delete('service-groups/:id')
    @ApiOperation({ summary: 'Delete service group' })
    @ApiResponse({ status: 200, description: 'Service group deleted successfully' })
    @ApiResponse({ status: 404, description: 'Service group not found' })
    @ApiParam({ name: 'id', description: 'Service Group ID' })
    @ApiBearerAuth()
    @UseGuards(RoleGuard)
    @Roles('admin')
    async deleteServiceGroup(@Param('id') id: string) {
        this.logger.log(`Deleting service group: ${id}`);

        await this.commandBus.execute(new DeleteServiceGroupCommand(id));

        return ResponseBuilder.success({ message: 'Service group deleted successfully' }, HTTP_STATUS.OK);
    }
}
