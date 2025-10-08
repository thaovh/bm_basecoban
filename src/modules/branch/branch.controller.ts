import { Controller, Get, Post, Put, Delete, Body, Param, Query, Logger, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

import { CreateBranchDto } from './application/commands/dto/create-branch.dto';
import { UpdateBranchDto } from './application/commands/dto/update-branch.dto';
import { GetBranchesDto } from './application/queries/dto/get-branches.dto';
import { CreateBranchCommand } from './application/commands/create-branch.command';
import { UpdateBranchCommand } from './application/commands/update-branch.command';
import { DeleteBranchCommand } from './application/commands/delete-branch.command';
import { GetBranchByIdQuery } from './application/queries/get-branch-by-id.query';
import { GetBranchesQuery } from './application/queries/get-branches.query';
import { GetBranchesByProvinceQuery } from './application/queries/get-branches-by-province.query';
import { ResponseBuilder, HTTP_STATUS } from '../../common/dtos/base-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Branches')
@Controller('api/v1')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BranchController {
    private readonly logger = new Logger(BranchController.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post('branches')
    @UseGuards(RoleGuard)
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Create a new branch' })
    @ApiResponse({ status: 201, description: 'Branch created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Branch code or name already exists' })
    async createBranch(@Body() createBranchDto: CreateBranchDto) {
        this.logger.log('Creating branch');
        const branch = await this.commandBus.execute(new CreateBranchCommand(createBranchDto));
        return ResponseBuilder.success(branch, HTTP_STATUS.CREATED);
    }

    @Get('branches')
    @ApiOperation({ summary: 'Get all branches with optional filters' })
    @ApiResponse({ status: 200, description: 'Branches retrieved successfully' })
    @ApiQuery({ name: 'search', required: false, description: 'Search term for branch name or code' })
    @ApiQuery({ name: 'provinceId', required: false, description: 'Filter by province ID' })
    @ApiQuery({ name: 'wardId', required: false, description: 'Filter by ward ID' })
    @ApiQuery({ name: 'hospitalLevel', required: false, description: 'Filter by hospital level' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
    @ApiQuery({ name: 'offset', required: false, description: 'Number of items to skip' })
    async getBranches(@Query() getBranchesDto: GetBranchesDto) {
        this.logger.log('Getting branches');
        const result = await this.queryBus.execute(new GetBranchesQuery(getBranchesDto));
        return ResponseBuilder.paginated(result.items, result.total, result.limit, result.offset);
    }

    @Get('branches/:id')
    @ApiOperation({ summary: 'Get branch by ID' })
    @ApiResponse({ status: 200, description: 'Branch retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Branch not found' })
    @ApiParam({ name: 'id', description: 'Branch ID' })
    async getBranchById(@Param('id') id: string) {
        this.logger.log(`Getting branch by ID: ${id}`);
        const branch = await this.queryBus.execute(new GetBranchByIdQuery(id));
        return ResponseBuilder.success(branch);
    }

    @Get('provinces/:provinceId/branches')
    @ApiOperation({ summary: 'Get branches by province ID' })
    @ApiResponse({ status: 200, description: 'Branches retrieved successfully' })
    @ApiParam({ name: 'provinceId', description: 'Province ID' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
    @ApiQuery({ name: 'offset', required: false, description: 'Number of items to skip' })
    async getBranchesByProvince(
        @Param('provinceId') provinceId: string,
        @Query('limit') limit: number = 10,
        @Query('offset') offset: number = 0
    ) {
        this.logger.log(`Getting branches by province: ${provinceId}`);
        const result = await this.queryBus.execute(new GetBranchesByProvinceQuery(provinceId, limit, offset));
        return ResponseBuilder.paginated(result.items, result.total, result.limit, result.offset);
    }

    @Put('branches/:id')
    @UseGuards(RoleGuard)
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Update branch by ID' })
    @ApiResponse({ status: 200, description: 'Branch updated successfully' })
    @ApiResponse({ status: 404, description: 'Branch not found' })
    @ApiResponse({ status: 409, description: 'Branch code or name already exists' })
    @ApiParam({ name: 'id', description: 'Branch ID' })
    async updateBranch(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
        this.logger.log(`Updating branch: ${id}`);
        const branch = await this.commandBus.execute(new UpdateBranchCommand(id, updateBranchDto));
        return ResponseBuilder.success(branch);
    }

    @Delete('branches/:id')
    @UseGuards(RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete branch by ID' })
    @ApiResponse({ status: 200, description: 'Branch deleted successfully' })
    @ApiResponse({ status: 404, description: 'Branch not found' })
    @ApiParam({ name: 'id', description: 'Branch ID' })
    async deleteBranch(@Param('id') id: string) {
        this.logger.log(`Deleting branch: ${id}`);
        await this.commandBus.execute(new DeleteBranchCommand(id));
        return ResponseBuilder.success({ message: 'Branch deleted successfully' });
    }
}
