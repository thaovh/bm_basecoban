import { Injectable, Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetServiceRequestByCodeQuery } from '../get-service-request-by-code.query';
import { ServiceRequest } from '../../../domain/service-request.entity';
import { IServiceRequestRepository } from '../../../domain/service-request.interface';

@QueryHandler(GetServiceRequestByCodeQuery)
export class GetServiceRequestByCodeHandler implements IQueryHandler<GetServiceRequestByCodeQuery> {
    private readonly logger = new Logger(GetServiceRequestByCodeHandler.name);

    constructor(
        @Inject('IServiceRequestRepository')
        private readonly serviceRequestRepository: IServiceRequestRepository,
    ) { }

    async execute(query: GetServiceRequestByCodeQuery): Promise<ServiceRequest> {
        this.logger.log(`Getting service request by code: ${query.serviceReqCode}`);

        try {
            const serviceRequest = await this.serviceRequestRepository.findByCode(query.serviceReqCode);

            if (!serviceRequest) {
                throw new Error(`Service request with code ${query.serviceReqCode} not found`);
            }

            return serviceRequest;

        } catch (error) {
            this.logger.error(`Error getting service request by code: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }
}
