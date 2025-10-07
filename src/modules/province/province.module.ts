import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { Province } from './domain/province.entity';
import { ProvinceRepository } from './infrastructure/database/province.repository';
import { ProvinceController } from './province.controller';

// Commands
import { CreateProvinceHandler } from './application/commands/impl/create-province.handler';
import { UpdateProvinceHandler } from './application/commands/impl/update-province.handler';
import { DeleteProvinceHandler } from './application/commands/impl/delete-province.handler';

// Queries
import { GetProvinceByIdHandler } from './application/queries/impl/get-province-by-id.handler';
import { GetProvincesHandler } from './application/queries/impl/get-provinces.handler';

const CommandHandlers = [
    CreateProvinceHandler,
    UpdateProvinceHandler,
    DeleteProvinceHandler,
];

const QueryHandlers = [
    GetProvinceByIdHandler,
    GetProvincesHandler,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([Province]),
        CqrsModule,
    ],
    controllers: [ProvinceController],
    providers: [
        {
            provide: 'IProvinceRepository',
            useClass: ProvinceRepository,
        },
        ...CommandHandlers,
        ...QueryHandlers,
    ],
    exports: [
        'IProvinceRepository',
    ],
})
export class ProvinceModule { }
