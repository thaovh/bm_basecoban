import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultStatus } from './domain/result-status.entity';
import { ResultStatusController } from './result-status.controller';
import { ResultStatusRepository } from './infrastructure/database/result-status.repository';

// Commands
import { CreateResultStatusHandler } from './application/commands/impl/create-result-status.handler';
import { UpdateResultStatusHandler } from './application/commands/impl/update-result-status.handler';
import { DeleteResultStatusHandler } from './application/commands/impl/delete-result-status.handler';

// Queries
import { GetResultStatusByIdHandler } from './application/queries/impl/get-result-status-by-id.handler';
import { GetResultStatusByCodeHandler } from './application/queries/impl/get-result-status-by-code.handler';
import { GetResultStatusesHandler } from './application/queries/impl/get-result-statuses.handler';
import { SearchResultStatusesHandler } from './application/queries/impl/search-result-statuses.handler';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([ResultStatus]),
    ],
    controllers: [ResultStatusController],
    providers: [
        {
            provide: 'IResultStatusRepository',
            useClass: ResultStatusRepository,
        },
        ResultStatusRepository,
        // Command Handlers
        CreateResultStatusHandler,
        UpdateResultStatusHandler,
        DeleteResultStatusHandler,
        // Query Handlers
        GetResultStatusByIdHandler,
        GetResultStatusByCodeHandler,
        GetResultStatusesHandler,
        SearchResultStatusesHandler,
    ],
    exports: ['IResultStatusRepository'],
})
export class ResultStatusModule { }
