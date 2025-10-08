import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { DepartmentType } from './domain/department-type.entity';
import { DepartmentTypeController } from './department-type.controller';
import { DepartmentTypeRepository } from './infrastructure/database/department-type.repository';

// Commands
import { CreateDepartmentTypeHandler } from './application/commands/impl/create-department-type.handler';
import { UpdateDepartmentTypeHandler } from './application/commands/impl/update-department-type.handler';
import { DeleteDepartmentTypeHandler } from './application/commands/impl/delete-department-type.handler';

// Queries
import { GetDepartmentTypeByIdHandler } from './application/queries/impl/get-department-type-by-id.handler';
import { GetDepartmentTypesHandler } from './application/queries/impl/get-department-types.handler';

const CommandHandlers = [
    CreateDepartmentTypeHandler,
    UpdateDepartmentTypeHandler,
    DeleteDepartmentTypeHandler,
];

const QueryHandlers = [
    GetDepartmentTypeByIdHandler,
    GetDepartmentTypesHandler,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([DepartmentType]),
        CqrsModule,
    ],
    controllers: [DepartmentTypeController],
    providers: [
        {
            provide: 'IDepartmentTypeRepository',
            useClass: DepartmentTypeRepository,
        },
        ...CommandHandlers,
        ...QueryHandlers,
    ],
    exports: [
        'IDepartmentTypeRepository',
    ],
})
export class DepartmentTypeModule { }
