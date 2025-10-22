import { Controller, Get, Post, Put, Delete, Body, Param, Query, Logger, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { DualAuthGuard } from '../../common/guards/dual-auth.guard';
import { HisAuth } from '../../common/decorators/his-auth.decorator';
import { ResponseBuilder, HTTP_STATUS } from '../../common/dtos/base-response.dto';

// Commands
import { CreatePatientCommand } from './application/commands/create-patient.command';
import { UpdatePatientCommand } from './application/commands/update-patient.command';
import { DeletePatientCommand } from './application/commands/delete-patient.command';
import { SyncPatientFromHisCommand } from './application/commands/sync-patient-from-his.command';

// Queries
import { GetPatientByIdQuery } from './application/queries/get-patient-by-id.query';
import { GetPatientByCodeQuery } from './application/queries/get-patient-by-code.query';
import { GetPatientByHisIdQuery } from './application/queries/get-patient-by-his-id.query';
import { GetPatientsQuery } from './application/queries/get-patients.query';
import { SearchPatientsQuery } from './application/queries/search-patients.query';

// DTOs
import { CreatePatientDto } from './application/commands/dto/create-patient.dto';
import { UpdatePatientDto } from './application/commands/dto/update-patient.dto';
import { SyncPatientFromHisDto } from './application/commands/dto/sync-patient-from-his.dto';
import { GetPatientsDto } from './application/queries/dto/get-patients.dto';
import { SearchPatientsDto } from './application/queries/dto/search-patients.dto';

@ApiTags('Patients')
@Controller('api/v1/patients')
@UseGuards(DualAuthGuard)
@ApiBearerAuth()
export class PatientController {
    private readonly logger = new Logger(PatientController.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create new patient' })
    @ApiResponse({ status: 201, description: 'Patient created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Patient code or HIS ID already exists' })
    async createPatient(@Body() createPatientDto: CreatePatientDto) {
        this.logger.log(`Creating patient: ${createPatientDto.patientName}`);
        const patient = await this.commandBus.execute(new CreatePatientCommand(createPatientDto));
        return ResponseBuilder.success(patient, HTTP_STATUS.CREATED);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get patient by ID' })
    @ApiParam({ name: 'id', description: 'Patient ID', example: 'uuid-patient-id' })
    @ApiResponse({ status: 200, description: 'Patient found' })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    async getPatientById(@Param('id') id: string) {
        this.logger.log(`Getting patient by ID: ${id}`);
        const patient = await this.queryBus.execute(new GetPatientByIdQuery(id));
        return ResponseBuilder.success(patient);
    }

    @Get('code/:patientCode')
    @ApiOperation({ summary: 'Get patient by code' })
    @ApiParam({ name: 'patientCode', description: 'Patient code', example: '0003110473' })
    @ApiResponse({ status: 200, description: 'Patient found' })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    async getPatientByCode(@Param('patientCode') patientCode: string) {
        this.logger.log(`Getting patient by code: ${patientCode}`);
        const patient = await this.queryBus.execute(new GetPatientByCodeQuery(patientCode));
        return ResponseBuilder.success(patient);
    }

    @Get('his/:hisId')
    @ApiOperation({ summary: 'Get patient by HIS ID' })
    @ApiParam({ name: 'hisId', description: 'HIS Patient ID', example: '3110600' })
    @ApiResponse({ status: 200, description: 'Patient found' })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    async getPatientByHisId(@Param('hisId') hisId: number) {
        this.logger.log(`Getting patient by HIS ID: ${hisId}`);
        const patient = await this.queryBus.execute(new GetPatientByHisIdQuery(hisId));
        return ResponseBuilder.success(patient);
    }

    @Get()
    @ApiOperation({ summary: 'Get patients list' })
    @ApiQuery({ name: 'limit', required: false, description: 'Page limit', example: 10 })
    @ApiQuery({ name: 'offset', required: false, description: 'Page offset', example: 0 })
    @ApiQuery({ name: 'search', required: false, description: 'Search term', example: 'Nguyen' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status', example: true })
    @ApiResponse({ status: 200, description: 'Patients list retrieved successfully' })
    async getPatients(@Query() query: GetPatientsDto) {
        this.logger.log(`Getting patients list: ${JSON.stringify(query)}`);
        const result = await this.queryBus.execute(new GetPatientsQuery(query));
        return ResponseBuilder.success(result);
    }

    @Get('search')
    @ApiOperation({ summary: 'Search patients' })
    @ApiQuery({ name: 'searchTerm', description: 'Search term', example: 'Nguyen' })
    @ApiQuery({ name: 'limit', required: false, description: 'Page limit', example: 10 })
    @ApiQuery({ name: 'offset', required: false, description: 'Page offset', example: 0 })
    @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
    async searchPatients(@Query() query: SearchPatientsDto) {
        this.logger.log(`Searching patients: ${JSON.stringify(query)}`);
        const result = await this.queryBus.execute(new SearchPatientsQuery(query));
        return ResponseBuilder.success(result);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update patient' })
    @ApiParam({ name: 'id', description: 'Patient ID', example: 'uuid-patient-id' })
    @ApiResponse({ status: 200, description: 'Patient updated successfully' })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    async updatePatient(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
        this.logger.log(`Updating patient: ${id}`);
        const patient = await this.commandBus.execute(new UpdatePatientCommand(id, updatePatientDto));
        return ResponseBuilder.success(patient);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete patient' })
    @ApiParam({ name: 'id', description: 'Patient ID', example: 'uuid-patient-id' })
    @ApiResponse({ status: 200, description: 'Patient deleted successfully' })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    async deletePatient(@Param('id') id: string) {
        this.logger.log(`Deleting patient: ${id}`);
        await this.commandBus.execute(new DeletePatientCommand(id));
        return ResponseBuilder.success({ message: 'Patient deleted successfully' });
    }

    @Post('sync-from-his')
    @HisAuth()
    @ApiOperation({ summary: 'Sync patient from HIS system' })
    @ApiResponse({ status: 200, description: 'Patient synced successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async syncPatientFromHis(@Body() syncDto: SyncPatientFromHisDto) {
        this.logger.log(`Syncing patient from HIS: ${syncDto.hisId}`);
        const patient = await this.commandBus.execute(new SyncPatientFromHisCommand(syncDto));
        return ResponseBuilder.success(patient);
    }
}
