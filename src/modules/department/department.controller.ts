import { Controller, Get, Post, Put, Delete, Body, Param, Query, Logger, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

import { CreateDepartmentDto } from './application/commands/dto/create-department.dto';
import { UpdateDepartmentDto } from './application/commands/dto/update-department.dto';
import { GetDepartmentsDto } from './application/queries/dto/get-departments.dto';
import { CreateDepartmentCommand } from './application/commands/create-department.command';
import { UpdateDepartmentCommand } from './application/commands/update-department.command';
import { DeleteDepartmentCommand } from './application/commands/delete-department.command';
import { GetDepartmentByIdQuery } from './application/queries/get-department-by-id.query';
import { GetDepartmentsQuery } from './application/queries/get-departments.query';
import { GetDepartmentsByBranchQuery } from './application/queries/get-departments-by-branch.query';
import { ResponseBuilder, HTTP_STATUS } from '../../common/dtos/base-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Departments')
@Controller('api/v1')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DepartmentController {
    private readonly logger = new Logger(DepartmentController.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post('departments')
    @UseGuards(RoleGuard)
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Create a new department' })
    @ApiResponse({ status: 201, description: 'Department created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Department code or name already exists' })
    async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
        this.logger.log('Creating department');
        const department = await this.commandBus.execute(new CreateDepartmentCommand(createDepartmentDto));
        return ResponseBuilder.success(department, HTTP_STATUS.CREATED);
    }

    @Get('departments')
    @ApiOperation({ summary: 'Get all departments with optional filters' })
    @ApiResponse({ status: 200, description: 'Departments retrieved successfully' })
    @ApiQuery({ name: 'search', required: false, description: 'Search term for department name or code' })
    @ApiQuery({ name: 'branchId', required: false, description: 'Filter by branch ID' })
    @ApiQuery({ name: 'departmentTypeId', required: false, description: 'Filter by department type ID' })
    @ApiQuery({ name: 'parentDepartmentId', required: false, description: 'Filter by parent department ID' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
    @ApiQuery({ name: 'parentOnly', required: false, description: 'Show only parent departments' })
    @ApiQuery({ name: 'subOnly', required: false, description: 'Show only sub departments' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
    @ApiQuery({ name: 'offset', required: false, description: 'Number of items to skip' })
    async getDepartments(@Query() getDepartmentsDto: GetDepartmentsDto) {
        this.logger.log('Getting departments');
        const result = await this.queryBus.execute(new GetDepartmentsQuery(getDepartmentsDto));
        return ResponseBuilder.paginated(result.items, result.total, result.limit, result.offset);
    }

    @Get('departments/:id')
    @ApiOperation({ summary: 'Get department by ID' })
    @ApiResponse({ status: 200, description: 'Department retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Department not found' })
    @ApiParam({ name: 'id', description: 'Department ID' })
    async getDepartmentById(@Param('id') id: string) {
        this.logger.log(`Getting department by ID: ${id}`);
        const department = await this.queryBus.execute(new GetDepartmentByIdQuery(id));
        return ResponseBuilder.success(department);
    }

    @Get('branches/:branchId/departments')
    @ApiOperation({ summary: 'Get departments by branch ID' })
    @ApiResponse({ status: 200, description: 'Departments retrieved successfully' })
    @ApiParam({ name: 'branchId', description: 'Branch ID' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
    @ApiQuery({ name: 'offset', required: false, description: 'Number of items to skip' })
    async getDepartmentsByBranch(
        @Param('branchId') branchId: string,
        @Query('limit') limit: number = 10,
        @Query('offset') offset: number = 0
    ) {
        this.logger.log(`Getting departments by branch: ${branchId}`);
        const result = await this.queryBus.execute(new GetDepartmentsByBranchQuery(branchId, limit, offset));
        return ResponseBuilder.paginated(result.items, result.total, result.limit, result.offset);
    }

    @Put('departments/:id')
    @UseGuards(RoleGuard)
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Update department by ID' })
    @ApiResponse({ status: 200, description: 'Department updated successfully' })
    @ApiResponse({ status: 404, description: 'Department not found' })
    @ApiResponse({ status: 409, description: 'Department code or name already exists' })
    @ApiParam({ name: 'id', description: 'Department ID' })
    async updateDepartment(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
        this.logger.log(`Updating department: ${id}`);
        const department = await this.commandBus.execute(new UpdateDepartmentCommand(id, updateDepartmentDto));
        return ResponseBuilder.success(department);
    }

    @Delete('departments/:id')
    @UseGuards(RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete department by ID' })
    @ApiResponse({ status: 200, description: 'Department deleted successfully' })
    @ApiResponse({ status: 404, description: 'Department not found' })
    @ApiParam({ name: 'id', description: 'Department ID' })
    async deleteDepartment(@Param('id') id: string) {
        this.logger.log(`Deleting department: ${id}`);
        await this.commandBus.execute(new DeleteDepartmentCommand(id));
        return ResponseBuilder.success({ message: 'Department deleted successfully' });
    }
}
