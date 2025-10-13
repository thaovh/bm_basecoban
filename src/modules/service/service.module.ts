import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ServiceController } from './service.controller';
import { Service } from './domain/service.entity';
import { ServicePriceHistory } from './domain/service-price-history.entity';
import { ServiceRepository } from './infrastructure/database/service.repository';
import { ServicePriceHistoryRepository } from './infrastructure/database/service-price-history.repository';
import { HisIntegrationModule } from '../his-integration/his-integration.module';

// Commands
import { CreateServiceHandler } from './application/commands/impl/create-service.handler';
import { UpdateServiceHandler } from './application/commands/impl/update-service.handler';
import { DeleteServiceHandler } from './application/commands/impl/delete-service.handler';
import { UpdateServicePriceHandler } from './application/commands/impl/update-service-price.handler';

// Queries
import { GetServicesHandler } from './application/queries/impl/get-services.handler';
import { GetServiceByIdHandler } from './application/queries/impl/get-service-by-id.handler';
import { GetServicesByGroupHandler } from './application/queries/impl/get-services-by-group.handler';
import { GetServicesByParentHandler } from './application/queries/impl/get-services-by-parent.handler';
import { GetServiceHierarchyHandler } from './application/queries/impl/get-service-hierarchy.handler';
import { GetServicePriceHistoryHandler } from './application/queries/impl/get-service-price-history.handler';
import { GetServicePriceAtDateHandler } from './application/queries/impl/get-service-price-at-date.handler';

const CommandHandlers = [
    CreateServiceHandler,
    UpdateServiceHandler,
    DeleteServiceHandler,
    UpdateServicePriceHandler,
];

const QueryHandlers = [
    GetServicesHandler,
    GetServiceByIdHandler,
    GetServicesByGroupHandler,
    GetServicesByParentHandler,
    GetServiceHierarchyHandler,
    GetServicePriceHistoryHandler,
    GetServicePriceAtDateHandler,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([Service, ServicePriceHistory]),
        CqrsModule,
        HisIntegrationModule,
    ],
    controllers: [ServiceController],
    providers: [
        // Repositories
        {
            provide: 'IServiceRepository',
            useClass: ServiceRepository,
        },
        {
            provide: 'IServicePriceHistoryRepository',
            useClass: ServicePriceHistoryRepository,
        },
        // Command Handlers
        ...CommandHandlers,
        // Query Handlers
        ...QueryHandlers,
    ],
    exports: [
        'IServiceRepository',
        'IServicePriceHistoryRepository',
    ],
})
export class ServiceModule { }
