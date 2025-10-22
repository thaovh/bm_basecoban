import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { HisServiceRequestController } from './his-service-request.controller';
import { HisServiceRequestRepository } from './infrastructure/database/his-service-request.repository';
import { GetServiceRequestHandler } from './application/queries/impl/get-service-request.handler';
import { hisTypeOrmConfig } from '../../infrastructure/database/his-typeorm.config';
import { HisIntegrationModule } from '../his-integration/his-integration.module';
import { ProvinceModule } from '../province/province.module';
import { WardModule } from '../ward/ward.module';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    HisIntegrationModule, // Added to resolve DualAuthGuard dependency
    ProvinceModule, // Added for province lookup
    WardModule, // Added for ward lookup
    TypeOrmModule.forRootAsync({
      name: 'his',
      imports: [ConfigModule],
      useFactory: hisTypeOrmConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [HisServiceRequestController],
  providers: [
    {
      provide: 'IHisServiceRequestRepository',
      useClass: HisServiceRequestRepository,
    },
    HisServiceRequestRepository,
    GetServiceRequestHandler,
  ],
  exports: ['IHisServiceRequestRepository'],
})
export class HisServiceRequestModule { }
