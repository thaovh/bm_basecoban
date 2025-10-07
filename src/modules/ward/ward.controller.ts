import { Controller, Get, Post, Put, Delete, Body, Param, Query, Logger, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

import { CreateWardDto } from './application/commands/dto/create-ward.dto';
import { UpdateWardDto } from './application/commands/dto/update-ward.dto';
import { GetWardsDto } from './application/queries/dto/get-wards.dto';
import { CreateWardCommand } from './application/commands/create-ward.command';
import { UpdateWardCommand } from './application/commands/update-ward.command';
import { DeleteWardCommand } from './application/commands/delete-ward.command';
import { GetWardByIdQuery } from './application/queries/get-ward-by-id.query';
import { GetWardsQuery } from './application/queries/get-wards.query';
import { GetWardsByProvinceQuery } from './application/queries/get-wards-by-province.query';
import { ResponseBuilder, HTTP_STATUS } from '../../common/dtos/base-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Wards')
@Controller('api/v1')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WardController {
    private readonly logger = new Logger(WardController.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Get('wards')
    @ApiOperation({ summary: 'Get all wards' })
    @ApiResponse({ status: 200, description: 'Wards retrieved successfully' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of items to skip' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
    @ApiQuery({ name: 'provinceId', required: false, type: String, description: 'Filter by province ID' })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
    async getWards(@Query() getWardsDto: GetWardsDto) {
        this.logger.log('Getting wards list');

        const result = await this.queryBus.execute(new GetWardsQuery(getWardsDto));

        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }

    @Get('wards/province/:provinceId')
    @ApiOperation({ summary: 'Get wards by province' })
    @ApiResponse({ status: 200, description: 'Wards retrieved successfully' })
    @ApiParam({ name: 'provinceId', description: 'Province ID' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of items to skip' })
    async getWardsByProvince(
        @Param('provinceId') provinceId: string,
        @Query('limit') limit: number = 10,
        @Query('offset') offset: number = 0
    ) {
        this.logger.log(`Getting wards by province: ${provinceId}`);

        const result = await this.queryBus.execute(new GetWardsByProvinceQuery(provinceId, limit, offset));

        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }

    @Get('wards/:id')
    @ApiOperation({ summary: 'Get ward by ID' })
    @ApiResponse({ status: 200, description: 'Ward retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Ward not found' })
    @ApiParam({ name: 'id', description: 'Ward ID' })
    async getWardById(@Param('id') id: string) {
        this.logger.log(`Getting ward by id: ${id}`);

        const result = await this.queryBus.execute(new GetWardByIdQuery(id));

        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }

    @Post('wards')
    @ApiOperation({ summary: 'Create new ward' })
    @ApiResponse({ status: 201, description: 'Ward created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'Province not found' })
    @ApiResponse({ status: 409, description: 'Ward code already exists' })
    // @ApiBearerAuth()
    // @UseGuards(RoleGuard)
    // @Roles('admin')
    async createWard(@Body() createWardDto: CreateWardDto) {
        this.logger.log(`Creating ward: ${createWardDto.wardName}`);

        const result = await this.commandBus.execute(new CreateWardCommand(createWardDto));

        return ResponseBuilder.success(result, HTTP_STATUS.CREATED);
    }

    @Put('wards/:id')
    @ApiOperation({ summary: 'Update ward' })
    @ApiResponse({ status: 200, description: 'Ward updated successfully' })
    @ApiResponse({ status: 404, description: 'Ward not found' })
    @ApiResponse({ status: 409, description: 'Ward code already exists' })
    @ApiParam({ name: 'id', description: 'Ward ID' })
    @ApiBearerAuth()
    @UseGuards(RoleGuard)
    @Roles('admin')
    async updateWard(@Param('id') id: string, @Body() updateWardDto: UpdateWardDto) {
        this.logger.log(`Updating ward: ${id}`);

        const result = await this.commandBus.execute(new UpdateWardCommand(id, updateWardDto));

        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }

    @Delete('wards/:id')
    @ApiOperation({ summary: 'Delete ward' })
    @ApiResponse({ status: 200, description: 'Ward deleted successfully' })
    @ApiResponse({ status: 404, description: 'Ward not found' })
    @ApiParam({ name: 'id', description: 'Ward ID' })
    @ApiBearerAuth()
    @UseGuards(RoleGuard)
    @Roles('admin')
    async deleteWard(@Param('id') id: string) {
        this.logger.log(`Deleting ward: ${id}`);

        await this.commandBus.execute(new DeleteWardCommand(id));

        return ResponseBuilder.success({ message: 'Ward deleted successfully' }, HTTP_STATUS.OK);
    }
}
