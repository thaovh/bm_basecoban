import { Injectable, Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SearchServiceRequestsQuery } from '../search-service-requests.query';
import { IServiceRequestRepository } from '../../../domain/service-request.interface';

@QueryHandler(SearchServiceRequestsQuery)
export class SearchServiceRequestsHandler implements IQueryHandler<SearchServiceRequestsQuery> {
    private readonly logger = new Logger(SearchServiceRequestsHandler.name);

    constructor(
        @Inject('IServiceRequestRepository')
        private readonly serviceRequestRepository: IServiceRequestRepository,
    ) { }

    async execute(query: SearchServiceRequestsQuery): Promise<any> {
        this.logger.log(`Searching service requests with term: ${query.query.searchTerm}`);

        try {
            const { searchTerm, limit = 10, offset = 0 } = query.query;

            const [serviceRequests, total] = await this.serviceRequestRepository.searchServiceRequests(
                searchTerm,
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
                searchTerm,
            };

        } catch (error) {
            this.logger.error(`Error searching service requests: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }
}
