import { Controller, Get, Post, Put, Delete, Body, Param, Query, Logger, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

import { CreateUnitOfMeasureDto } from './application/commands/dto/create-unit-of-measure.dto';
import { UpdateUnitOfMeasureDto } from './application/commands/dto/update-unit-of-measure.dto';
import { GetUnitOfMeasuresDto } from './application/queries/dto/get-unit-of-measures.dto';
import { CreateUnitOfMeasureCommand } from './application/commands/create-unit-of-measure.command';
import { UpdateUnitOfMeasureCommand } from './application/commands/update-unit-of-measure.command';
import { DeleteUnitOfMeasureCommand } from './application/commands/delete-unit-of-measure.command';
import { GetUnitOfMeasureByIdQuery } from './application/queries/get-unit-of-measure-by-id.query';
import { GetUnitOfMeasuresQuery } from './application/queries/get-unit-of-measures.query';
import { ResponseBuilder, HTTP_STATUS } from '../../common/dtos/base-response.dto';
import { DualAuthGuard } from '../../common/guards/dual-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { HisAuth } from '../../common/decorators/his-auth.decorator';

@ApiTags('Unit of Measures')
@Controller('api/v1/unit-of-measures')
@UseGuards(DualAuthGuard)
@ApiBearerAuth()
export class UnitOfMeasureController {
    private readonly logger = new Logger(UnitOfMeasureController.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Get()
    @HisAuth() // Allows HIS token for read operations
    @ApiOperation({ summary: 'Get all unit of measures (supports both JWT and HIS token authentication)' })
    @ApiResponse({ status: 200, description: 'Unit of measures retrieved successfully' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of items to skip' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
    async getUnitOfMeasures(@Query() getUnitOfMeasuresDto: GetUnitOfMeasuresDto) {
        this.logger.log('Getting unit of measures list');
        const [unitOfMeasures, total] = await this.queryBus.execute(new GetUnitOfMeasuresQuery(getUnitOfMeasuresDto));
        return ResponseBuilder.success({ items: unitOfMeasures, total, limit: getUnitOfMeasuresDto.limit, offset: getUnitOfMeasuresDto.offset }, HTTP_STATUS.OK);
    }

    @Get(':id')
    @HisAuth() // Allows HIS token for read operations
    @ApiOperation({ summary: 'Get unit of measure by ID (supports both JWT and HIS token authentication)' })
    @ApiResponse({ status: 200, description: 'Unit of measure retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Unit of measure not found' })
    @ApiParam({ name: 'id', description: 'Unit of Measure ID' })
    async getUnitOfMeasureById(@Param('id') id: string) {
        this.logger.log(`Getting unit of measure by id: ${id}`);
        const unitOfMeasure = await this.queryBus.execute(new GetUnitOfMeasureByIdQuery(id));
        return ResponseBuilder.success(unitOfMeasure, HTTP_STATUS.OK);
    }

    @Post()
    @UseGuards(RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create new unit of measure (Admin only)' })
    @ApiResponse({ status: 201, description: 'Unit of measure created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Unit of measure code already exists' })
    async createUnitOfMeasure(@Body() createUnitOfMeasureDto: CreateUnitOfMeasureDto) {
        this.logger.log(`Creating unit of measure: ${createUnitOfMeasureDto.unitOfMeasureName}`);
        const unitOfMeasure = await this.commandBus.execute(new CreateUnitOfMeasureCommand(createUnitOfMeasureDto));
        return ResponseBuilder.success(unitOfMeasure, HTTP_STATUS.CREATED);
    }

    @Put(':id')
    @UseGuards(RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update unit of measure (Admin only)' })
    @ApiResponse({ status: 200, description: 'Unit of measure updated successfully' })
    @ApiResponse({ status: 404, description: 'Unit of measure not found' })
    @ApiParam({ name: 'id', description: 'Unit of Measure ID' })
    async updateUnitOfMeasure(@Param('id') id: string, @Body() updateUnitOfMeasureDto: UpdateUnitOfMeasureDto) {
        this.logger.log(`Updating unit of measure: ${id}`);
        const unitOfMeasure = await this.commandBus.execute(new UpdateUnitOfMeasureCommand(id, updateUnitOfMeasureDto));
        return ResponseBuilder.success(unitOfMeasure, HTTP_STATUS.OK);
    }

    @Delete(':id')
    @UseGuards(RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete unit of measure (Admin only)' })
    @ApiResponse({ status: 200, description: 'Unit of measure deleted successfully' })
    @ApiResponse({ status: 404, description: 'Unit of measure not found' })
    @ApiParam({ name: 'id', description: 'Unit of Measure ID' })
    async deleteUnitOfMeasure(@Param('id') id: string) {
        this.logger.log(`Deleting unit of measure: ${id}`);
        await this.commandBus.execute(new DeleteUnitOfMeasureCommand(id));
        return ResponseBuilder.success({ message: 'Unit of measure deleted successfully' }, HTTP_STATUS.OK);
    }
}
