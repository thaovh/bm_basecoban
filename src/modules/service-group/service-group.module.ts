import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { HisIntegrationModule } from '../his-integration/his-integration.module';

import { ServiceGroup } from './domain/service-group.entity';
import { ServiceGroupController } from './service-group.controller';
import { ServiceGroupRepository } from './infrastructure/database/service-group.repository';

// Commands
import { CreateServiceGroupHandler } from './application/commands/impl/create-service-group.handler';
import { UpdateServiceGroupHandler } from './application/commands/impl/update-service-group.handler';
import { DeleteServiceGroupHandler } from './application/commands/impl/delete-service-group.handler';

// Queries
import { GetServiceGroupsHandler } from './application/queries/impl/get-service-groups.handler';
import { GetServiceGroupByIdHandler } from './application/queries/impl/get-service-group-by-id.handler';

const CommandHandlers = [
  CreateServiceGroupHandler,
  UpdateServiceGroupHandler,
  DeleteServiceGroupHandler,
];

const QueryHandlers = [
  GetServiceGroupsHandler,
  GetServiceGroupByIdHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceGroup]),
    CqrsModule,
    HisIntegrationModule,
  ],
  controllers: [ServiceGroupController],
  providers: [
    ServiceGroupRepository,
    {
      provide: 'IServiceGroupRepository',
      useClass: ServiceGroupRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [
    ServiceGroupRepository,
    'IServiceGroupRepository',
  ],
})
export class ServiceGroupModule {}
