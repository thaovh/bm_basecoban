import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { GetResultTrackingsByServiceRequestQuery } from '../get-result-trackings-by-service-request.query';
import { ResultTracking } from '../../../domain/result-tracking.entity';
import { IResultTrackingRepository } from '../../../domain/result-tracking.interface';

@QueryHandler(GetResultTrackingsByServiceRequestQuery)
export class GetResultTrackingsByServiceRequestHandler implements IQueryHandler<GetResultTrackingsByServiceRequestQuery> {
    private readonly logger = new Logger(GetResultTrackingsByServiceRequestHandler.name);

    constructor(
        @Inject('IResultTrackingRepository')
        private readonly resultTrackingRepository: IResultTrackingRepository,
    ) { }

    async execute(query: GetResultTrackingsByServiceRequestQuery): Promise<ResultTracking[]> {
        this.logger.log(`Executing GetResultTrackingsByServiceRequestQuery for service request: ${query.serviceRequestId}`);

        try {
            const resultTrackings = await this.resultTrackingRepository.findByServiceRequestId(query.serviceRequestId);

            this.logger.log(`Successfully found ${resultTrackings.length} ResultTrackings for service request: ${query.serviceRequestId}`);
            return resultTrackings;
        } catch (error) {
            this.logger.error(`Failed to get ResultTrackings by service request: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
