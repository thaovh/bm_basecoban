import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequest } from './domain/service-request.entity';
import { ServiceRequestItem } from './domain/service-request-item.entity';
import { ServiceRequestItemTest } from './domain/service-request-item-test.entity';
import { ServiceRequestController } from './service-request.controller';
import { ServiceRequestRepository } from './infrastructure/database/service-request.repository';
import { ServiceRequestItemRepository } from './infrastructure/database/service-request-item.repository';
import { ServiceRequestSaveService } from './application/services/service-request-save.service';

// Import related modules for relationships
import { ServiceModule } from '../service/service.module';
import { ServiceGroupModule } from '../service-group/service-group.module';
import { UnitOfMeasureModule } from '../unit-of-measure/unit-of-measure.module';
import { ServiceTestModule } from '../service-test/service-test.module';
import { HisIntegrationModule } from '../his-integration/his-integration.module';
import { HisServiceRequestModule } from '../his-service-request/his-service-request.module';
import { ResultTrackingModule } from '../result-tracking/result-tracking.module';

// Commands
import { CreateServiceRequestHandler } from './application/commands/impl/create-service-request.handler';
import { UpdateServiceRequestHandler } from './application/commands/impl/update-service-request.handler';
import { DeleteServiceRequestHandler } from './application/commands/impl/delete-service-request.handler';
import { SyncServiceRequestFromHisHandler } from './application/commands/impl/sync-service-request-from-his.handler';
import { SaveServiceRequestFromHisHandler } from './application/commands/impl/save-service-request-from-his.handler';
import { SaveServiceRequestFromLisHandler } from './application/commands/impl/save-service-request-from-lis.handler';
import { BulkSaveServiceRequestsFromHisHandler } from './application/commands/impl/bulk-save-service-requests-from-his.handler';
import { UpdateServiceRequestFromHisHandler } from './application/commands/impl/update-service-request-from-his.handler';
import { SaveToLisHandler } from './application/commands/impl/save-to-lis.handler';

// Queries
import { GetServiceRequestByIdHandler } from './application/queries/impl/get-service-request-by-id.handler';
import { GetServiceRequestByCodeHandler } from './application/queries/impl/get-service-request-by-code.handler';
import { GetServiceRequestByHisIdHandler } from './application/queries/impl/get-service-request-by-his-id.handler';
import { GetServiceRequestsHandler } from './application/queries/impl/get-service-requests.handler';
import { SearchServiceRequestsHandler } from './application/queries/impl/search-service-requests.handler';
import { GetServiceRequestsByPatientHandler } from './application/queries/impl/get-service-requests-by-patient.handler';
import { GetServiceRequestsByTreatmentHandler } from './application/queries/impl/get-service-requests-by-treatment.handler';
import { GetHisServiceRequestHandler } from './application/queries/impl/get-his-service-request.handler';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([ServiceRequest, ServiceRequestItem, ServiceRequestItemTest]),
        ServiceModule,
        ServiceGroupModule,
        UnitOfMeasureModule,
        ServiceTestModule,
        HisIntegrationModule, // For DualAuthGuard dependency
        HisServiceRequestModule, // For HIS service request queries
        ResultTrackingModule, // For result tracking commands
    ],
    controllers: [ServiceRequestController],
    providers: [
        {
            provide: 'IServiceRequestRepository',
            useClass: ServiceRequestRepository,
        },
        {
            provide: 'IServiceRequestItemRepository',
            useClass: ServiceRequestItemRepository,
        },
        {
            provide: 'IServiceRequestSaveService',
            useClass: ServiceRequestSaveService,
        },
        ServiceRequestRepository,
        ServiceRequestItemRepository,
        ServiceRequestSaveService,
        // Command Handlers
        CreateServiceRequestHandler,
        UpdateServiceRequestHandler,
        DeleteServiceRequestHandler,
        SyncServiceRequestFromHisHandler,
        SaveServiceRequestFromHisHandler,
        SaveServiceRequestFromLisHandler,
        BulkSaveServiceRequestsFromHisHandler,
        UpdateServiceRequestFromHisHandler,
        SaveToLisHandler,
        // Query Handlers
        GetServiceRequestByIdHandler,
        GetServiceRequestByCodeHandler,
        GetServiceRequestByHisIdHandler,
        GetServiceRequestsHandler,
        SearchServiceRequestsHandler,
        GetServiceRequestsByPatientHandler,
        GetServiceRequestsByTreatmentHandler,
        GetHisServiceRequestHandler,
    ],
    exports: ['IServiceRequestRepository', 'IServiceRequestItemRepository'],
})
export class ServiceRequestModule { }
