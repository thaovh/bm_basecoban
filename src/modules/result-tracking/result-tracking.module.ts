import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultTracking } from './domain/result-tracking.entity';
import { ResultTrackingController } from './result-tracking.controller';
import { ResultTrackingRepository } from './infrastructure/database/result-tracking.repository';

// Commands
import { CreateResultTrackingHandler } from './application/commands/impl/create-result-tracking.handler';
import { UpdateResultTrackingHandler } from './application/commands/impl/update-result-tracking.handler';
import { DeleteResultTrackingHandler } from './application/commands/impl/delete-result-tracking.handler';
import { CheckInTrackingHandler } from './application/commands/impl/check-in-tracking.handler';
import { CheckOutTrackingHandler } from './application/commands/impl/check-out-tracking.handler';

// Queries
import { GetResultTrackingByIdHandler } from './application/queries/impl/get-result-tracking-by-id.handler';
import { GetResultTrackingsByServiceRequestHandler } from './application/queries/impl/get-result-trackings-by-service-request.handler';
import { GetResultTrackingsHandler } from './application/queries/impl/get-result-trackings.handler';
import { GetCurrentTrackingHandler } from './application/queries/impl/get-current-tracking.handler';
import { GetTrackingStatisticsHandler } from './application/queries/impl/get-tracking-statistics.handler';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([ResultTracking]),
    ],
    controllers: [ResultTrackingController],
    providers: [
        {
            provide: 'IResultTrackingRepository',
            useClass: ResultTrackingRepository,
        },
        ResultTrackingRepository,
        // Command Handlers
        CreateResultTrackingHandler,
        UpdateResultTrackingHandler,
        DeleteResultTrackingHandler,
        CheckInTrackingHandler,
        CheckOutTrackingHandler,
        // Query Handlers
        GetResultTrackingByIdHandler,
        GetResultTrackingsByServiceRequestHandler,
        GetResultTrackingsHandler,
        GetCurrentTrackingHandler,
        GetTrackingStatisticsHandler,
    ],
    exports: ['IResultTrackingRepository'],
})
export class ResultTrackingModule { }
