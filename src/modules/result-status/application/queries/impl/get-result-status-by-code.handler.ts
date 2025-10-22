import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Logger, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { GetResultStatusByCodeQuery } from '../get-result-status-by-code.query';
import { ResultStatus } from '../../../domain/result-status.entity';
import { IResultStatusRepository } from '../../../domain/result-status.interface';

@QueryHandler(GetResultStatusByCodeQuery)
export class GetResultStatusByCodeHandler implements IQueryHandler<GetResultStatusByCodeQuery> {
    private readonly logger = new Logger(GetResultStatusByCodeHandler.name);

    constructor(
        @Inject('IResultStatusRepository')
        private readonly resultStatusRepository: IResultStatusRepository,
    ) {}

    async execute(query: GetResultStatusByCodeQuery): Promise<ResultStatus> {
        this.logger.log(`Executing GetResultStatusByCodeQuery for code: ${query.statusCode}`);
        
        try {
            const resultStatus = await this.resultStatusRepository.findByCode(query.statusCode);
            
            if (!resultStatus) {
                throw new NotFoundException(`ResultStatus with code '${query.statusCode}' not found`);
            }
            
            this.logger.log(`Successfully found ResultStatus: ${resultStatus.id}`);
            return resultStatus;
        } catch (error) {
            this.logger.error(`Failed to get ResultStatus by code: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
