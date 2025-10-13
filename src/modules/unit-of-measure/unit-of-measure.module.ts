import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { HisIntegrationModule } from '../his-integration/his-integration.module';

import { UnitOfMeasure } from './domain/unit-of-measure.entity';
import { UnitOfMeasureController } from './unit-of-measure.controller';
import { UnitOfMeasureRepository } from './infrastructure/database/unit-of-measure.repository';
import { CreateUnitOfMeasureHandler } from './application/commands/impl/create-unit-of-measure.handler';
import { UpdateUnitOfMeasureHandler } from './application/commands/impl/update-unit-of-measure.handler';
import { DeleteUnitOfMeasureHandler } from './application/commands/impl/delete-unit-of-measure.handler';
import { GetUnitOfMeasuresHandler } from './application/queries/impl/get-unit-of-measures.handler';
import { GetUnitOfMeasureByIdHandler } from './application/queries/impl/get-unit-of-measure-by-id.handler';

const CommandHandlers = [
    CreateUnitOfMeasureHandler,
    UpdateUnitOfMeasureHandler,
    DeleteUnitOfMeasureHandler,
];

const QueryHandlers = [
    GetUnitOfMeasuresHandler,
    GetUnitOfMeasureByIdHandler,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([UnitOfMeasure]),
        CqrsModule,
        HisIntegrationModule, // Added to resolve DualAuthGuard dependency
    ],
    controllers: [UnitOfMeasureController],
    providers: [
        UnitOfMeasureRepository,
        {
            provide: 'IUnitOfMeasureRepository',
            useClass: UnitOfMeasureRepository,
        },
        ...CommandHandlers,
        ...QueryHandlers,
    ],
    exports: [
        'IUnitOfMeasureRepository',
        TypeOrmModule.forFeature([UnitOfMeasure]),
    ],
})
export class UnitOfMeasureModule { }
