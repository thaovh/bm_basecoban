import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { Department } from './domain/department.entity';
import { DepartmentController } from './department.controller';
import { DepartmentRepository } from './infrastructure/database/department.repository';

// Commands
import { CreateDepartmentHandler } from './application/commands/impl/create-department.handler';
import { UpdateDepartmentHandler } from './application/commands/impl/update-department.handler';
import { DeleteDepartmentHandler } from './application/commands/impl/delete-department.handler';

// Queries
import { GetDepartmentByIdHandler } from './application/queries/impl/get-department-by-id.handler';
import { GetDepartmentsHandler } from './application/queries/impl/get-departments.handler';
import { GetDepartmentsByBranchHandler } from './application/queries/impl/get-departments-by-branch.handler';

const CommandHandlers = [
    CreateDepartmentHandler,
    UpdateDepartmentHandler,
    DeleteDepartmentHandler,
];

const QueryHandlers = [
    GetDepartmentByIdHandler,
    GetDepartmentsHandler,
    GetDepartmentsByBranchHandler,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([Department]),
        CqrsModule,
    ],
    controllers: [DepartmentController],
    providers: [
        {
            provide: 'IDepartmentRepository',
            useClass: DepartmentRepository,
        },
        ...CommandHandlers,
        ...QueryHandlers,
    ],
    exports: [
        'IDepartmentRepository',
    ],
})
export class DepartmentModule { }
