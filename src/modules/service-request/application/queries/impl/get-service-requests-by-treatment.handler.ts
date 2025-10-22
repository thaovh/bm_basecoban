import { Injectable, Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetServiceRequestsByTreatmentQuery } from '../get-service-requests-by-treatment.query';
import { IServiceRequestRepository } from '../../../domain/service-request.interface';

@QueryHandler(GetServiceRequestsByTreatmentQuery)
export class GetServiceRequestsByTreatmentHandler implements IQueryHandler<GetServiceRequestsByTreatmentQuery> {
    private readonly logger = new Logger(GetServiceRequestsByTreatmentHandler.name);

    constructor(
        @Inject('IServiceRequestRepository')
        private readonly serviceRequestRepository: IServiceRequestRepository,
    ) { }

    async execute(query: GetServiceRequestsByTreatmentQuery): Promise<any> {
        this.logger.log(`Getting service requests by treatment ID: ${query.treatmentId}`);

        try {
            const { limit = 10, offset = 0 } = query.query;

            const [serviceRequests, total] = await this.serviceRequestRepository.findByTreatmentId(
                query.treatmentId,
                limit,
                offset
            );

            return {
                serviceRequests,
                total,
                limit,
                offset,
                hasNext: offset + limit < total,
                hasPrev: offset > 0,
                treatmentId: query.treatmentId,
            };

        } catch (error) {
            this.logger.error(`Error getting service requests by treatment: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }
}
