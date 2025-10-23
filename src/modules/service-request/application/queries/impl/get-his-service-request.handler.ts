import { Injectable, Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetHisServiceRequestQuery } from '../get-his-service-request.query';
import { IHisServiceRequestRepository } from '../../../../his-service-request/domain/his-service-request.interface';

@QueryHandler(GetHisServiceRequestQuery)
export class GetHisServiceRequestHandler implements IQueryHandler<GetHisServiceRequestQuery> {
    private readonly logger = new Logger(GetHisServiceRequestHandler.name);

    constructor(
        @Inject('IHisServiceRequestRepository')
        private readonly hisServiceRequestRepository: IHisServiceRequestRepository,
    ) { }

    async execute(query: GetHisServiceRequestQuery): Promise<any> {
        this.logger.log(`Getting HIS service request by code: ${query.serviceReqCode}`);

        try {
            const hisServiceRequest = await this.hisServiceRequestRepository.getServiceRequestByCode(query.serviceReqCode);

            if (!hisServiceRequest) {
                throw new Error(`HIS service request with code ${query.serviceReqCode} not found`);
            }

            return hisServiceRequest;

        } catch (error) {
            this.logger.error(`Error getting HIS service request: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }
}
