import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { SampleType } from './domain/sample-type.entity';
import { SampleTypeRepository } from './infrastructure/database/sample-type.repository';

// Commands
import { CreateSampleTypeHandler } from './application/commands/impl/create-sample-type.handler';
import { UpdateSampleTypeHandler } from './application/commands/impl/update-sample-type.handler';
import { DeleteSampleTypeHandler } from './application/commands/impl/delete-sample-type.handler';

// Queries
import { GetSampleTypeByIdHandler } from './application/queries/impl/get-sample-type-by-id.handler';
import { GetSampleTypesHandler } from './application/queries/impl/get-sample-types.handler';
import { GenerateSampleCodeHandler } from './application/queries/impl/generate-sample-code.handler';

import { SampleTypeController } from './sample-type.controller';

const CommandHandlers = [
    CreateSampleTypeHandler,
    UpdateSampleTypeHandler,
    DeleteSampleTypeHandler,
];

const QueryHandlers = [
    GetSampleTypeByIdHandler,
    GetSampleTypesHandler,
    GenerateSampleCodeHandler,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([SampleType]),
        CqrsModule,
    ],
    controllers: [SampleTypeController],
    providers: [
        {
            provide: 'ISampleTypeRepository',
            useClass: SampleTypeRepository,
        },
        ...CommandHandlers,
        ...QueryHandlers,
    ],
    exports: [
        'ISampleTypeRepository',
    ],
})
export class SampleTypeModule { }
