import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Logger, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { GetCurrentTrackingQuery } from '../get-current-tracking.query';
import { ResultTracking } from '../../../domain/result-tracking.entity';
import { IResultTrackingRepository } from '../../../domain/result-tracking.interface';

@QueryHandler(GetCurrentTrackingQuery)
export class GetCurrentTrackingHandler implements IQueryHandler<GetCurrentTrackingQuery> {
    private readonly logger = new Logger(GetCurrentTrackingHandler.name);

    constructor(
        @Inject('IResultTrackingRepository')
        private readonly resultTrackingRepository: IResultTrackingRepository,
    ) { }

    async execute(query: GetCurrentTrackingQuery): Promise<ResultTracking | null> {
        this.logger.log(`Executing GetCurrentTrackingQuery for service request: ${query.serviceRequestId}`);

        try {
            const resultTracking = await this.resultTrackingRepository.findCurrentTrackingByServiceRequest(query.serviceRequestId);

            if (resultTracking) {
                this.logger.log(`Successfully found current tracking: ${resultTracking.id}`);
            } else {
                this.logger.log(`No current tracking found for service request: ${query.serviceRequestId}`);
            }

            return resultTracking;
        } catch (error) {
            this.logger.error(`Failed to get current tracking: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
