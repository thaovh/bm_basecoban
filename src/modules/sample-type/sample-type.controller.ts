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
    HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ResponseBuilder } from '../../common/dtos/base-response.dto';

import { CreateSampleTypeDto } from './application/commands/dto/create-sample-type.dto';
import { UpdateSampleTypeDto } from './application/commands/dto/update-sample-type.dto';
import { GetSampleTypesDto } from './application/queries/dto/get-sample-types.dto';

import { CreateSampleTypeCommand } from './application/commands/create-sample-type.command';
import { UpdateSampleTypeCommand } from './application/commands/update-sample-type.command';
import { DeleteSampleTypeCommand } from './application/commands/delete-sample-type.command';

import { GetSampleTypeByIdQuery } from './application/queries/get-sample-type-by-id.query';
import { GetSampleTypesQuery } from './application/queries/get-sample-types.query';
import { GenerateSampleCodeQuery } from './application/queries/generate-sample-code.query';

@ApiTags('Sample Types')
@Controller('api/v1/sample-types')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class SampleTypeController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Create a new sample type' })
    @ApiResponse({ status: 201, description: 'Sample type created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Sample type code or name already exists' })
    async createSampleType(@Body() createSampleTypeDto: CreateSampleTypeDto) {
        const sampleType = await this.commandBus.execute(new CreateSampleTypeCommand(createSampleTypeDto));
        return ResponseBuilder.success(sampleType, HttpStatus.CREATED);
    }

    @Get()
    @Roles('admin', 'manager', 'user')
    @ApiOperation({ summary: 'Get all sample types with pagination and filters' })
    @ApiResponse({ status: 200, description: 'Sample types retrieved successfully' })
    async getSampleTypes(@Query() getSampleTypesDto: GetSampleTypesDto) {
        const result = await this.queryBus.execute(new GetSampleTypesQuery(getSampleTypesDto));
        return ResponseBuilder.paginated(result.items, result.total, getSampleTypesDto.limit || 10, getSampleTypesDto.offset || 0);
    }

    @Get('generate-code/:typeCode/:sequence')
    @Roles('admin', 'manager', 'user')
    @ApiOperation({ summary: 'Generate sample code for a specific type and sequence' })
    @ApiResponse({ status: 200, description: 'Sample code generated successfully' })
    @ApiResponse({ status: 404, description: 'Sample type not found' })
    async generateSampleCode(
        @Param('typeCode') typeCode: string,
        @Param('sequence') sequence: number
    ) {
        const result = await this.queryBus.execute(new GenerateSampleCodeQuery(typeCode, sequence));
        return ResponseBuilder.success(result);
    }

    @Get(':id')
    @Roles('admin', 'manager', 'user')
    @ApiOperation({ summary: 'Get sample type by ID' })
    @ApiResponse({ status: 200, description: 'Sample type retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Sample type not found' })
    async getSampleTypeById(@Param('id') id: string) {
        const sampleType = await this.queryBus.execute(new GetSampleTypeByIdQuery(id));
        return ResponseBuilder.success(sampleType);
    }

    @Put(':id')
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Update sample type by ID' })
    @ApiResponse({ status: 200, description: 'Sample type updated successfully' })
    @ApiResponse({ status: 404, description: 'Sample type not found' })
    @ApiResponse({ status: 409, description: 'Sample type code or name already exists' })
    async updateSampleType(@Param('id') id: string, @Body() updateSampleTypeDto: UpdateSampleTypeDto) {
        const sampleType = await this.commandBus.execute(new UpdateSampleTypeCommand(id, updateSampleTypeDto));
        return ResponseBuilder.success(sampleType);
    }

    @Delete(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Delete sample type by ID' })
    @ApiResponse({ status: 200, description: 'Sample type deleted successfully' })
    @ApiResponse({ status: 404, description: 'Sample type not found' })
    async deleteSampleType(@Param('id') id: string) {
        await this.commandBus.execute(new DeleteSampleTypeCommand(id));
        return ResponseBuilder.success({ message: 'Sample type deleted successfully' });
    }
}
