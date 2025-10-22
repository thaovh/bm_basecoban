import { Injectable, Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetServiceRequestByHisIdQuery } from '../get-service-request-by-his-id.query';
import { ServiceRequest } from '../../../domain/service-request.entity';
import { IServiceRequestRepository } from '../../../domain/service-request.interface';

@QueryHandler(GetServiceRequestByHisIdQuery)
export class GetServiceRequestByHisIdHandler implements IQueryHandler<GetServiceRequestByHisIdQuery> {
    private readonly logger = new Logger(GetServiceRequestByHisIdHandler.name);

    constructor(
        @Inject('IServiceRequestRepository')
        private readonly serviceRequestRepository: IServiceRequestRepository,
    ) { }

    async execute(query: GetServiceRequestByHisIdQuery): Promise<ServiceRequest> {
        this.logger.log(`Getting service request by HIS ID: ${query.hisServiceReqId}`);

        try {
            const serviceRequest = await this.serviceRequestRepository.findByHisId(query.hisServiceReqId);

            if (!serviceRequest) {
                throw new Error(`Service request with HIS ID ${query.hisServiceReqId} not found`);
            }

            return serviceRequest;

        } catch (error) {
            this.logger.error(`Error getting service request by HIS ID: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }
}
