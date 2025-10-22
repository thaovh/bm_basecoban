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
import { DualAuthGuard } from '../../common/guards/dual-auth.guard';
import { HisAuth } from '../../common/decorators/his-auth.decorator';

import { CreateServiceRequestDto, UpdateServiceRequestDto, GetServiceRequestsDto, SearchServiceRequestsDto } from './domain/service-request.dto';
import { SaveServiceRequestFromHisDto, BulkSaveServiceRequestFromHisDto, UpdateServiceRequestFromHisDto } from './domain/service-request-save.dto';
import { SaveToLisDto } from './domain/save-to-lis.dto';

import { CreateServiceRequestCommand } from './application/commands/create-service-request.command';
import { UpdateServiceRequestCommand } from './application/commands/update-service-request.command';
import { DeleteServiceRequestCommand } from './application/commands/delete-service-request.command';
import { SyncServiceRequestFromHisCommand } from './application/commands/sync-service-request-from-his.command';
import { SaveServiceRequestFromHisCommand } from './application/commands/save-service-request-from-his.command';
import { SaveServiceRequestFromLisCommand } from './application/commands/save-service-request-from-lis.command';
import { BulkSaveServiceRequestsFromHisCommand } from './application/commands/bulk-save-service-requests-from-his.command';
import { UpdateServiceRequestFromHisCommand } from './application/commands/update-service-request-from-his.command';
import { SaveToLisCommand } from './application/commands/save-to-lis.command';

import { GetServiceRequestByIdQuery } from './application/queries/get-service-request-by-id.query';
import { GetServiceRequestByCodeQuery } from './application/queries/get-service-request-by-code.query';
import { GetServiceRequestByHisIdQuery } from './application/queries/get-service-request-by-his-id.query';
import { GetServiceRequestsQuery } from './application/queries/get-service-requests.query';
import { SearchServiceRequestsQuery } from './application/queries/search-service-requests.query';
import { GetServiceRequestsByPatientQuery } from './application/queries/get-service-requests-by-patient.query';
import { GetServiceRequestsByTreatmentQuery } from './application/queries/get-service-requests-by-treatment.query';

@ApiTags('Service Requests')
@Controller('api/v1/service-requests')
@UseGuards(DualAuthGuard)
@ApiBearerAuth()
export class ServiceRequestController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create new service request' })
    @ApiResponse({ status: 201, description: 'Service request created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createServiceRequest(@Body() createServiceRequestDto: CreateServiceRequestDto) {
        return this.commandBus.execute(new CreateServiceRequestCommand(createServiceRequestDto));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get service request by ID' })
    @ApiParam({ name: 'id', description: 'Service request ID' })
    @ApiResponse({ status: 200, description: 'Service request found' })
    @ApiResponse({ status: 404, description: 'Service request not found' })
    async getServiceRequestById(@Param('id') id: string) {
        return this.queryBus.execute(new GetServiceRequestByIdQuery(id));
    }

    @Get('code/:serviceReqCode')
    @ApiOperation({ summary: 'Get service request by code' })
    @ApiParam({ name: 'serviceReqCode', description: 'Service request code' })
    @ApiResponse({ status: 200, description: 'Service request found' })
    @ApiResponse({ status: 404, description: 'Service request not found' })
    async getServiceRequestByCode(@Param('serviceReqCode') serviceReqCode: string) {
        return this.queryBus.execute(new GetServiceRequestByCodeQuery(serviceReqCode));
    }

    @Get('his/:hisServiceReqId')
    @ApiOperation({ summary: 'Get service request by HIS ID' })
    @ApiParam({ name: 'hisServiceReqId', description: 'HIS Service Request ID' })
    @ApiResponse({ status: 200, description: 'Service request found' })
    @ApiResponse({ status: 404, description: 'Service request not found' })
    async getServiceRequestByHisId(@Param('hisServiceReqId') hisServiceReqId: number) {
        return this.queryBus.execute(new GetServiceRequestByHisIdQuery(hisServiceReqId));
    }

    @Get()
    @ApiOperation({ summary: 'Get service requests list' })
    @ApiQuery({ name: 'limit', required: false, description: 'Page limit' })
    @ApiQuery({ name: 'offset', required: false, description: 'Page offset' })
    @ApiQuery({ name: 'search', required: false, description: 'Search term' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
    @ApiQuery({ name: 'patientId', required: false, description: 'Filter by patient ID' })
    @ApiQuery({ name: 'treatmentId', required: false, description: 'Filter by treatment ID' })
    @ApiResponse({ status: 200, description: 'Service requests list' })
    async getServiceRequests(@Query() query: GetServiceRequestsDto) {
        return this.queryBus.execute(new GetServiceRequestsQuery(query));
    }

    @Get('search')
    @ApiOperation({ summary: 'Search service requests' })
    @ApiQuery({ name: 'searchTerm', required: true, description: 'Search term' })
    @ApiQuery({ name: 'limit', required: false, description: 'Page limit' })
    @ApiQuery({ name: 'offset', required: false, description: 'Page offset' })
    @ApiResponse({ status: 200, description: 'Search results' })
    async searchServiceRequests(@Query() query: SearchServiceRequestsDto) {
        return this.queryBus.execute(new SearchServiceRequestsQuery(query));
    }

    @Get('patient/:patientId')
    @ApiOperation({ summary: 'Get service requests by patient ID' })
    @ApiParam({ name: 'patientId', description: 'Patient ID' })
    @ApiQuery({ name: 'limit', required: false, description: 'Page limit' })
    @ApiQuery({ name: 'offset', required: false, description: 'Page offset' })
    @ApiResponse({ status: 200, description: 'Service requests by patient' })
    async getServiceRequestsByPatient(
        @Param('patientId') patientId: number,
        @Query() query: GetServiceRequestsDto,
    ) {
        return this.queryBus.execute(new GetServiceRequestsByPatientQuery(patientId, query));
    }

    @Get('treatment/:treatmentId')
    @ApiOperation({ summary: 'Get service requests by treatment ID' })
    @ApiParam({ name: 'treatmentId', description: 'Treatment ID' })
    @ApiQuery({ name: 'limit', required: false, description: 'Page limit' })
    @ApiQuery({ name: 'offset', required: false, description: 'Page offset' })
    @ApiResponse({ status: 200, description: 'Service requests by treatment' })
    async getServiceRequestsByTreatment(
        @Param('treatmentId') treatmentId: number,
        @Query() query: GetServiceRequestsDto,
    ) {
        return this.queryBus.execute(new GetServiceRequestsByTreatmentQuery(treatmentId, query));
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update service request' })
    @ApiParam({ name: 'id', description: 'Service request ID' })
    @ApiResponse({ status: 200, description: 'Service request updated successfully' })
    @ApiResponse({ status: 404, description: 'Service request not found' })
    async updateServiceRequest(
        @Param('id') id: string,
        @Body() updateServiceRequestDto: UpdateServiceRequestDto,
    ) {
        return this.commandBus.execute(new UpdateServiceRequestCommand(id, updateServiceRequestDto));
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete service request' })
    @ApiParam({ name: 'id', description: 'Service request ID' })
    @ApiResponse({ status: 200, description: 'Service request deleted successfully' })
    @ApiResponse({ status: 404, description: 'Service request not found' })
    async deleteServiceRequest(@Param('id') id: string) {
        return this.commandBus.execute(new DeleteServiceRequestCommand(id));
    }

    @Post('sync-from-his')
    @HisAuth()
    @ApiOperation({ summary: 'Sync service request from HIS system' })
    @ApiResponse({ status: 201, description: 'Service request synced successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async syncServiceRequestFromHis(@Body() hisServiceRequestData: any) {
        return this.commandBus.execute(new SyncServiceRequestFromHisCommand(hisServiceRequestData));
    }

    @Post('save-from-his')
    @HisAuth()
    @ApiOperation({ summary: 'Save service request from HIS data' })
    @ApiResponse({ status: 201, description: 'Service request saved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Service request already exists' })
    async saveServiceRequestFromHis(@Body() saveDto: SaveServiceRequestFromHisDto) {
        return this.commandBus.execute(new SaveServiceRequestFromHisCommand(saveDto));
    }

    @Post('save-from-lis')
    @ApiOperation({ summary: 'Save service request from LIS form data' })
    @ApiResponse({ status: 201, description: 'Service request saved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async saveServiceRequestFromLis(@Body() createDto: CreateServiceRequestDto) {
        return this.commandBus.execute(new SaveServiceRequestFromLisCommand(createDto));
    }

    @Post('bulk-save-from-his')
    @HisAuth()
    @ApiOperation({ summary: 'Bulk save service requests from HIS data' })
    @ApiResponse({ status: 201, description: 'Service requests saved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async bulkSaveServiceRequestsFromHis(@Body() bulkSaveDto: BulkSaveServiceRequestFromHisDto) {
        return this.commandBus.execute(new BulkSaveServiceRequestsFromHisCommand(bulkSaveDto.serviceRequests));
    }

    @Put('update-from-his/:id')
    @HisAuth()
    @ApiOperation({ summary: 'Update service request from HIS data' })
    @ApiParam({ name: 'id', description: 'Service request ID' })
    @ApiResponse({ status: 200, description: 'Service request updated successfully' })
    @ApiResponse({ status: 404, description: 'Service request not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async updateServiceRequestFromHis(
        @Param('id') id: string,
        @Body() updateDto: UpdateServiceRequestFromHisDto,
    ) {
        return this.commandBus.execute(new UpdateServiceRequestFromHisCommand(id, updateDto));
    }

    @Post('save-to-lis')
    @HisAuth()
    @ApiOperation({ summary: 'Save service request to LIS with automatic tracking setup' })
    @ApiResponse({ status: 201, description: 'Service request saved and tracking started successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'Service request not found in HIS' })
    @ApiResponse({ status: 409, description: 'Service request already exists in LIS' })
    async saveToLis(@Body() saveToLisDto: SaveToLisDto) {
        return this.commandBus.execute(new SaveToLisCommand(saveToLisDto));
    }
}
