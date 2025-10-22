import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { SearchResultStatusesQuery } from '../search-result-statuses.query';
import { ResultStatus } from '../../../domain/result-status.entity';
import { IResultStatusRepository } from '../../../domain/result-status.interface';

export interface SearchResultStatusesResult {
    resultStatuses: ResultStatus[];
    total: number;
    limit: number;
    offset: number;
    searchTerm: string;
}

@QueryHandler(SearchResultStatusesQuery)
export class SearchResultStatusesHandler implements IQueryHandler<SearchResultStatusesQuery> {
    private readonly logger = new Logger(SearchResultStatusesHandler.name);

    constructor(
        @Inject('IResultStatusRepository')
        private readonly resultStatusRepository: IResultStatusRepository,
    ) {}

    async execute(query: SearchResultStatusesQuery): Promise<SearchResultStatusesResult> {
        this.logger.log(`Executing SearchResultStatusesQuery with term: "${query.query.searchTerm}"`);
        
        try {
            const { searchTerm, limit = 10, offset = 0 } = query.query;
            
            const [resultStatuses, total] = await this.resultStatusRepository.search(searchTerm, limit, offset);

            const result: SearchResultStatusesResult = {
                resultStatuses,
                total,
                limit,
                offset,
                searchTerm,
            };
            
            this.logger.log(`Successfully found ${resultStatuses.length} ResultStatuses matching "${searchTerm}" out of ${total} total`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to search ResultStatuses: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
