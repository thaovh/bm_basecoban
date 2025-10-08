import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { Branch } from './domain/branch.entity';
import { BranchController } from './branch.controller';
import { BranchRepository } from './infrastructure/database/branch.repository';

// Commands
import { CreateBranchHandler } from './application/commands/impl/create-branch.handler';
import { UpdateBranchHandler } from './application/commands/impl/update-branch.handler';
import { DeleteBranchHandler } from './application/commands/impl/delete-branch.handler';

// Queries
import { GetBranchByIdHandler } from './application/queries/impl/get-branch-by-id.handler';
import { GetBranchesHandler } from './application/queries/impl/get-branches.handler';
import { GetBranchesByProvinceHandler } from './application/queries/impl/get-branches-by-province.handler';

const CommandHandlers = [
    CreateBranchHandler,
    UpdateBranchHandler,
    DeleteBranchHandler,
];

const QueryHandlers = [
    GetBranchByIdHandler,
    GetBranchesHandler,
    GetBranchesByProvinceHandler,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([Branch]),
        CqrsModule,
    ],
    controllers: [BranchController],
    providers: [
        {
            provide: 'IBranchRepository',
            useClass: BranchRepository,
        },
        ...CommandHandlers,
        ...QueryHandlers,
    ],
    exports: [
        'IBranchRepository',
    ],
})
export class BranchModule { }
