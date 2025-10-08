import { Controller, Get, Post, Put, Delete, Body, Param, Query, Logger, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

import { CreateDepartmentTypeDto } from './application/commands/dto/create-department-type.dto';
import { UpdateDepartmentTypeDto } from './application/commands/dto/update-department-type.dto';
import { GetDepartmentTypesDto } from './application/queries/dto/get-department-types.dto';
import { CreateDepartmentTypeCommand } from './application/commands/create-department-type.command';
import { UpdateDepartmentTypeCommand } from './application/commands/update-department-type.command';
import { DeleteDepartmentTypeCommand } from './application/commands/delete-department-type.command';
import { GetDepartmentTypeByIdQuery } from './application/queries/get-department-type-by-id.query';
import { GetDepartmentTypesQuery } from './application/queries/get-department-types.query';
import { ResponseBuilder, HTTP_STATUS } from '../../common/dtos/base-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Department Types')
@Controller('api/v1')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DepartmentTypeController {
    private readonly logger = new Logger(DepartmentTypeController.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post('department-types')
    @UseGuards(RoleGuard)
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Create a new department type' })
    @ApiResponse({ status: 201, description: 'Department type created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Department type code or name already exists' })
    async createDepartmentType(@Body() createDepartmentTypeDto: CreateDepartmentTypeDto) {
        this.logger.log('Creating department type');
        const departmentType = await this.commandBus.execute(new CreateDepartmentTypeCommand(createDepartmentTypeDto));
        return ResponseBuilder.success(departmentType, HTTP_STATUS.CREATED);
    }

    @Get('department-types')
    @ApiOperation({ summary: 'Get all department types with optional filters' })
    @ApiResponse({ status: 200, description: 'Department types retrieved successfully' })
    @ApiQuery({ name: 'search', required: false, description: 'Search term for department type name or code' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
    @ApiQuery({ name: 'offset', required: false, description: 'Number of items to skip' })
    async getDepartmentTypes(@Query() getDepartmentTypesDto: GetDepartmentTypesDto) {
        this.logger.log('Getting department types');
        const result = await this.queryBus.execute(new GetDepartmentTypesQuery(getDepartmentTypesDto));
        return ResponseBuilder.paginated(result.items, result.total, result.limit, result.offset);
    }

    @Get('department-types/:id')
    @ApiOperation({ summary: 'Get department type by ID' })
    @ApiResponse({ status: 200, description: 'Department type retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Department type not found' })
    @ApiParam({ name: 'id', description: 'Department type ID' })
    async getDepartmentTypeById(@Param('id') id: string) {
        this.logger.log(`Getting department type by ID: ${id}`);
        const departmentType = await this.queryBus.execute(new GetDepartmentTypeByIdQuery(id));
        return ResponseBuilder.success(departmentType);
    }

    @Put('department-types/:id')
    @UseGuards(RoleGuard)
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Update department type by ID' })
    @ApiResponse({ status: 200, description: 'Department type updated successfully' })
    @ApiResponse({ status: 404, description: 'Department type not found' })
    @ApiResponse({ status: 409, description: 'Department type code or name already exists' })
    @ApiParam({ name: 'id', description: 'Department type ID' })
    async updateDepartmentType(@Param('id') id: string, @Body() updateDepartmentTypeDto: UpdateDepartmentTypeDto) {
        this.logger.log(`Updating department type: ${id}`);
        const departmentType = await this.commandBus.execute(new UpdateDepartmentTypeCommand(id, updateDepartmentTypeDto));
        return ResponseBuilder.success(departmentType);
    }

    @Delete('department-types/:id')
    @UseGuards(RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete department type by ID' })
    @ApiResponse({ status: 200, description: 'Department type deleted successfully' })
    @ApiResponse({ status: 404, description: 'Department type not found' })
    @ApiParam({ name: 'id', description: 'Department type ID' })
    async deleteDepartmentType(@Param('id') id: string) {
        this.logger.log(`Deleting department type: ${id}`);
        await this.commandBus.execute(new DeleteDepartmentTypeCommand(id));
        return ResponseBuilder.success({ message: 'Department type deleted successfully' });
    }
}
