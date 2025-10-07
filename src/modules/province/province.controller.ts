import { Controller, Get, Post, Put, Delete, Body, Param, Query, Logger, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

import { CreateProvinceDto } from './application/commands/dto/create-province.dto';
import { UpdateProvinceDto } from './application/commands/dto/update-province.dto';
import { GetProvincesDto } from './application/queries/dto/get-provinces.dto';
import { CreateProvinceCommand } from './application/commands/create-province.command';
import { UpdateProvinceCommand } from './application/commands/update-province.command';
import { DeleteProvinceCommand } from './application/commands/delete-province.command';
import { GetProvinceByIdQuery } from './application/queries/get-province-by-id.query';
import { GetProvincesQuery } from './application/queries/get-provinces.query';
import { ResponseBuilder, HTTP_STATUS } from '../../common/dtos/base-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Provinces')
@Controller('api/v1')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ProvinceController {
    private readonly logger = new Logger(ProvinceController.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Get('provinces')
    @ApiOperation({ summary: 'Get all provinces' })
    @ApiResponse({ status: 200, description: 'Provinces retrieved successfully' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of items to skip' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
    async getProvinces(@Query() getProvincesDto: GetProvincesDto) {
        this.logger.log('Getting provinces list');

        const result = await this.queryBus.execute(new GetProvincesQuery(getProvincesDto));

        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }

    @Get('provinces/:id')
    @ApiOperation({ summary: 'Get province by ID' })
    @ApiResponse({ status: 200, description: 'Province retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Province not found' })
    @ApiParam({ name: 'id', description: 'Province ID' })
    async getProvinceById(@Param('id') id: string) {
        this.logger.log(`Getting province by id: ${id}`);

        const result = await this.queryBus.execute(new GetProvinceByIdQuery(id));

        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }

    @Post('provinces')
    @ApiOperation({ summary: 'Create new province' })
    @ApiResponse({ status: 201, description: 'Province created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Province code or name already exists' })
    @ApiBearerAuth()
    @UseGuards(RoleGuard)
    @Roles('admin')
    async createProvince(@Body() createProvinceDto: CreateProvinceDto) {
        this.logger.log(`Creating province: ${createProvinceDto.provinceName}`);

        const result = await this.commandBus.execute(new CreateProvinceCommand(createProvinceDto));

        return ResponseBuilder.success(result, HTTP_STATUS.CREATED);
    }

    @Put('provinces/:id')
    @ApiOperation({ summary: 'Update province' })
    @ApiResponse({ status: 200, description: 'Province updated successfully' })
    @ApiResponse({ status: 404, description: 'Province not found' })
    @ApiResponse({ status: 409, description: 'Province code or name already exists' })
    @ApiParam({ name: 'id', description: 'Province ID' })
    @ApiBearerAuth()
    @UseGuards(RoleGuard)
    @Roles('admin')
    async updateProvince(@Param('id') id: string, @Body() updateProvinceDto: UpdateProvinceDto) {
        this.logger.log(`Updating province: ${id}`);

        const result = await this.commandBus.execute(new UpdateProvinceCommand(id, updateProvinceDto));

        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }

    @Delete('provinces/:id')
    @ApiOperation({ summary: 'Delete province' })
    @ApiResponse({ status: 200, description: 'Province deleted successfully' })
    @ApiResponse({ status: 404, description: 'Province not found' })
    @ApiParam({ name: 'id', description: 'Province ID' })
    @ApiBearerAuth()
    @UseGuards(RoleGuard)
    @Roles('admin')
    async deleteProvince(@Param('id') id: string) {
        this.logger.log(`Deleting province: ${id}`);

        await this.commandBus.execute(new DeleteProvinceCommand(id));

        return ResponseBuilder.success({ message: 'Province deleted successfully' }, HTTP_STATUS.OK);
    }
}
