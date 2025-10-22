import { Injectable, Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetServiceRequestByIdQuery } from '../get-service-request-by-id.query';
import { ServiceRequest } from '../../../domain/service-request.entity';
import { IServiceRequestRepository } from '../../../domain/service-request.interface';

@QueryHandler(GetServiceRequestByIdQuery)
export class GetServiceRequestByIdHandler implements IQueryHandler<GetServiceRequestByIdQuery> {
    private readonly logger = new Logger(GetServiceRequestByIdHandler.name);

    constructor(
        @Inject('IServiceRequestRepository')
        private readonly serviceRequestRepository: IServiceRequestRepository,
    ) { }

    async execute(query: GetServiceRequestByIdQuery): Promise<ServiceRequest> {
        this.logger.log(`Getting service request by ID: ${query.id}`);

        try {
            const serviceRequest = await this.serviceRequestRepository.findById(query.id);

            if (!serviceRequest) {
                throw new Error(`Service request with ID ${query.id} not found`);
            }

            return serviceRequest;

        } catch (error) {
            this.logger.error(`Error getting service request by ID: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }
}
