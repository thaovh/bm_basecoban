import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { GetTrackingStatisticsQuery } from '../get-tracking-statistics.query';
import { IResultTrackingRepository } from '../../../domain/result-tracking.interface';

@QueryHandler(GetTrackingStatisticsQuery)
export class GetTrackingStatisticsHandler implements IQueryHandler<GetTrackingStatisticsQuery> {
    private readonly logger = new Logger(GetTrackingStatisticsHandler.name);

    constructor(
        @Inject('IResultTrackingRepository')
        private readonly resultTrackingRepository: IResultTrackingRepository,
    ) { }

    async execute(query: GetTrackingStatisticsQuery): Promise<any> {
        this.logger.log(`Executing GetTrackingStatisticsQuery`);

        try {
            const statistics = await this.resultTrackingRepository.getTrackingStatistics(
                query.serviceRequestId,
                query.roomId,
                query.resultStatusId
            );

            this.logger.log(`Successfully retrieved tracking statistics`);
            return statistics;
        } catch (error) {
            this.logger.error(`Failed to get tracking statistics: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
