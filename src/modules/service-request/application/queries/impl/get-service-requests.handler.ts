import { Injectable, Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetServiceRequestsQuery } from '../get-service-requests.query';
import { IServiceRequestRepository } from '../../../domain/service-request.interface';

@QueryHandler(GetServiceRequestsQuery)
export class GetServiceRequestsHandler implements IQueryHandler<GetServiceRequestsQuery> {
    private readonly logger = new Logger(GetServiceRequestsHandler.name);

    constructor(
        @Inject('IServiceRequestRepository')
        private readonly serviceRequestRepository: IServiceRequestRepository,
    ) { }

    async execute(query: GetServiceRequestsQuery): Promise<any> {
        this.logger.log(`Getting service requests with query: ${JSON.stringify(query.query)}`);

        try {
            const { limit = 10, offset = 0, isActive, patientId, treatmentId } = query.query;

            let serviceRequests: any[];
            let total: number;

            if (patientId) {
                [serviceRequests, total] = await this.serviceRequestRepository.findByPatientId(patientId, limit, offset);
            } else if (treatmentId) {
                [serviceRequests, total] = await this.serviceRequestRepository.findByTreatmentId(treatmentId, limit, offset);
            } else if (isActive !== undefined) {
                if (isActive) {
                    [serviceRequests, total] = await this.serviceRequestRepository.findActiveServiceRequests(limit, offset);
                } else {
                    [serviceRequests, total] = await this.serviceRequestRepository.findAllServiceRequests(limit, offset);
                }
            } else {
                [serviceRequests, total] = await this.serviceRequestRepository.findActiveServiceRequests(limit, offset);
            }

            return {
                serviceRequests,
                total,
                limit,
                offset,
                hasNext: offset + limit < total,
                hasPrev: offset > 0,
            };

        } catch (error) {
            this.logger.error(`Error getting service requests: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }
}
