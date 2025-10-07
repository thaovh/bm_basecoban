import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { Ward } from './domain/ward.entity';
import { WardRepository } from './infrastructure/database/ward.repository';
import { WardController } from './ward.controller';
import { ProvinceModule } from '../province/province.module';

// Commands
import { CreateWardHandler } from './application/commands/impl/create-ward.handler';
import { UpdateWardHandler } from './application/commands/impl/update-ward.handler';
import { DeleteWardHandler } from './application/commands/impl/delete-ward.handler';

// Queries
import { GetWardByIdHandler } from './application/queries/impl/get-ward-by-id.handler';
import { GetWardsHandler } from './application/queries/impl/get-wards.handler';
import { GetWardsByProvinceHandler } from './application/queries/impl/get-wards-by-province.handler';

const CommandHandlers = [
    CreateWardHandler,
    UpdateWardHandler,
    DeleteWardHandler,
];

const QueryHandlers = [
    GetWardByIdHandler,
    GetWardsHandler,
    GetWardsByProvinceHandler,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([Ward]),
        CqrsModule,
        ProvinceModule,
    ],
    controllers: [WardController],
    providers: [
        {
            provide: 'IWardRepository',
            useClass: WardRepository,
        },
        ...CommandHandlers,
        ...QueryHandlers,
    ],
    exports: [
        'IWardRepository',
    ],
})
export class WardModule {}
