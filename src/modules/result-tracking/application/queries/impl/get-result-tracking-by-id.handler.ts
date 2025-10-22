import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Logger, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { GetResultTrackingByIdQuery } from '../get-result-tracking-by-id.query';
import { ResultTracking } from '../../../domain/result-tracking.entity';
import { IResultTrackingRepository } from '../../../domain/result-tracking.interface';

@QueryHandler(GetResultTrackingByIdQuery)
export class GetResultTrackingByIdHandler implements IQueryHandler<GetResultTrackingByIdQuery> {
    private readonly logger = new Logger(GetResultTrackingByIdHandler.name);

    constructor(
        @Inject('IResultTrackingRepository')
        private readonly resultTrackingRepository: IResultTrackingRepository,
    ) { }

    async execute(query: GetResultTrackingByIdQuery): Promise<ResultTracking> {
        this.logger.log(`Executing GetResultTrackingByIdQuery for ID: ${query.id}`);

        try {
            const resultTracking = await this.resultTrackingRepository.findById(query.id);

            if (!resultTracking) {
                throw new NotFoundException(`ResultTracking with ID '${query.id}' not found`);
            }

            this.logger.log(`Successfully found ResultTracking: ${resultTracking.id}`);
            return resultTracking;
        } catch (error) {
            this.logger.error(`Failed to get ResultTracking by ID: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
