import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceTest } from './domain/service-test.entity';
import { ServiceTestController } from './service-test.controller';
import { ServiceTestRepository } from './infrastructure/database/service-test.repository';
import { CreateServiceTestHandler } from './application/commands/impl/create-service-test.handler';
import { UpdateServiceTestHandler } from './application/commands/impl/update-service-test.handler';
import { DeleteServiceTestHandler } from './application/commands/impl/delete-service-test.handler';
import { GetServiceTestsHandler } from './application/queries/impl/get-service-tests.handler';
import { GetServiceTestByIdHandler } from './application/queries/impl/get-service-test-by-id.handler';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ServiceTest]),
  ],
  controllers: [ServiceTestController],
  providers: [
    {
      provide: 'IServiceTestRepository',
      useClass: ServiceTestRepository,
    },
    ServiceTestRepository,
    CreateServiceTestHandler,
    UpdateServiceTestHandler,
    DeleteServiceTestHandler,
    GetServiceTestsHandler,
    GetServiceTestByIdHandler,
  ],
  exports: ['IServiceTestRepository'],
})
export class ServiceTestModule {}
