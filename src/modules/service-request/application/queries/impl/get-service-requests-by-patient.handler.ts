import { Injectable, Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetServiceRequestsByPatientQuery } from '../get-service-requests-by-patient.query';
import { IServiceRequestRepository } from '../../../domain/service-request.interface';

@QueryHandler(GetServiceRequestsByPatientQuery)
export class GetServiceRequestsByPatientHandler implements IQueryHandler<GetServiceRequestsByPatientQuery> {
    private readonly logger = new Logger(GetServiceRequestsByPatientHandler.name);

    constructor(
        @Inject('IServiceRequestRepository')
        private readonly serviceRequestRepository: IServiceRequestRepository,
    ) { }

    async execute(query: GetServiceRequestsByPatientQuery): Promise<any> {
        this.logger.log(`Getting service requests by patient ID: ${query.patientId}`);

        try {
            const { limit = 10, offset = 0 } = query.query;

            const [serviceRequests, total] = await this.serviceRequestRepository.findByPatientId(
                query.patientId,
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
                patientId: query.patientId,
            };

        } catch (error) {
            this.logger.error(`Error getting service requests by patient: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }
}
