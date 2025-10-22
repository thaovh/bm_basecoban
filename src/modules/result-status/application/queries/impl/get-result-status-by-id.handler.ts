import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Logger, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { GetResultStatusByIdQuery } from '../get-result-status-by-id.query';
import { ResultStatus } from '../../../domain/result-status.entity';
import { IResultStatusRepository } from '../../../domain/result-status.interface';

@QueryHandler(GetResultStatusByIdQuery)
export class GetResultStatusByIdHandler implements IQueryHandler<GetResultStatusByIdQuery> {
    private readonly logger = new Logger(GetResultStatusByIdHandler.name);

    constructor(
        @Inject('IResultStatusRepository')
        private readonly resultStatusRepository: IResultStatusRepository,
    ) {}

    async execute(query: GetResultStatusByIdQuery): Promise<ResultStatus> {
        this.logger.log(`Executing GetResultStatusByIdQuery for ID: ${query.id}`);
        
        try {
            const resultStatus = await this.resultStatusRepository.findById(query.id);
            
            if (!resultStatus) {
                throw new NotFoundException(`ResultStatus with ID '${query.id}' not found`);
            }
            
            this.logger.log(`Successfully found ResultStatus: ${resultStatus.id}`);
            return resultStatus;
        } catch (error) {
            this.logger.error(`Failed to get ResultStatus by ID: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
