import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { GetResultStatusesQuery } from '../get-result-statuses.query';
import { ResultStatus } from '../../../domain/result-status.entity';
import { IResultStatusRepository } from '../../../domain/result-status.interface';

export interface GetResultStatusesResult {
    resultStatuses: ResultStatus[];
    total: number;
    limit: number;
    offset: number;
}

@QueryHandler(GetResultStatusesQuery)
export class GetResultStatusesHandler implements IQueryHandler<GetResultStatusesQuery> {
    private readonly logger = new Logger(GetResultStatusesHandler.name);

    constructor(
        @Inject('IResultStatusRepository')
        private readonly resultStatusRepository: IResultStatusRepository,
    ) {}

    async execute(query: GetResultStatusesQuery): Promise<GetResultStatusesResult> {
        this.logger.log(`Executing GetResultStatusesQuery with limit: ${query.query.limit}, offset: ${query.query.offset}`);
        
        try {
            const { limit = 10, offset = 0, search, isActive, sortByOrder = true } = query.query;
            
            let resultStatuses: ResultStatus[];
            let total: number;

            if (search) {
                // Search functionality
                [resultStatuses, total] = await this.resultStatusRepository.search(search, limit, offset);
            } else if (isActive !== undefined) {
                // Filter by active status
                if (isActive) {
                    [resultStatuses, total] = await this.resultStatusRepository.findActive(limit, offset);
                } else {
                    [resultStatuses, total] = await this.resultStatusRepository.findAll(limit, offset);
                }
            } else {
                // Get all
                [resultStatuses, total] = await this.resultStatusRepository.findAll(limit, offset);
            }

            // Sort by order number if requested
            if (sortByOrder) {
                resultStatuses.sort((a, b) => a.orderNumber - b.orderNumber);
            }

            const result: GetResultStatusesResult = {
                resultStatuses,
                total,
                limit,
                offset,
            };
            
            this.logger.log(`Successfully found ${resultStatuses.length} ResultStatuses out of ${total} total`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to get ResultStatuses: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
