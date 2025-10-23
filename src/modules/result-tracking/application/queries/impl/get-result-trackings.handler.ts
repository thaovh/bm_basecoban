import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { GetResultTrackingsQuery } from '../get-result-trackings.query';
import { ResultTracking } from '../../../domain/result-tracking.entity';
import { IResultTrackingRepository } from '../../../domain/result-tracking.interface';

export interface GetResultTrackingsResult {
    resultTrackings: ResultTracking[];
    total: number;
    limit: number;
    offset: number;
}

@QueryHandler(GetResultTrackingsQuery)
export class GetResultTrackingsHandler implements IQueryHandler<GetResultTrackingsQuery> {
    private readonly logger = new Logger(GetResultTrackingsHandler.name);

    constructor(
        @Inject('IResultTrackingRepository')
        private readonly resultTrackingRepository: IResultTrackingRepository,
    ) { }

    async execute(query: GetResultTrackingsQuery): Promise<GetResultTrackingsResult> {
        this.logger.log(`Executing GetResultTrackingsQuery with limit: ${query.query.limit}, offset: ${query.query.offset}`);

        try {
            const {
                limit = 10,
                offset = 0,
                search,
                serviceRequestId,
                resultStatusId,
                requestRoomId,
                inRoomId,
                sampleTypeId,
                sampleCode,
                startDate,
                endDate,
                isActive,
                isOverdue
            } = query.query;

            let resultTrackings: ResultTracking[];
            let total: number;

            if (search) {
                // Search functionality
                [resultTrackings, total] = await this.resultTrackingRepository.search(search, limit, offset);
            } else if (startDate && endDate) {
                // Filter by date range
                [resultTrackings, total] = await this.resultTrackingRepository.findByDateRange(
                    new Date(startDate),
                    new Date(endDate),
                    limit,
                    offset
                );
            } else if (isOverdue) {
                // Get overdue trackings
                [resultTrackings, total] = await this.resultTrackingRepository.findOverdueTrackings(limit, offset);
            } else if (serviceRequestId) {
                // Filter by service request
                resultTrackings = await this.resultTrackingRepository.findByServiceRequestId(serviceRequestId);
                total = resultTrackings.length;
                resultTrackings = resultTrackings.slice(offset, offset + limit);
            } else if (resultStatusId) {
                // Filter by result status
                resultTrackings = await this.resultTrackingRepository.findByResultStatusId(resultStatusId);
                total = resultTrackings.length;
                resultTrackings = resultTrackings.slice(offset, offset + limit);
            } else if (requestRoomId) {
                // Filter by request room
                if (isActive) {
                    resultTrackings = await this.resultTrackingRepository.findActiveInRoom(requestRoomId);
                } else {
                    resultTrackings = await this.resultTrackingRepository.findByRoomId(requestRoomId);
                }
                total = resultTrackings.length;
                resultTrackings = resultTrackings.slice(offset, offset + limit);
            } else if (inRoomId) {
                // Filter by in room
                resultTrackings = await this.resultTrackingRepository.findByInRoomId(inRoomId);
                total = resultTrackings.length;
                resultTrackings = resultTrackings.slice(offset, offset + limit);
            } else {
                // Get all
                [resultTrackings, total] = await this.resultTrackingRepository.findAll(limit, offset);
            }

            const result: GetResultTrackingsResult = {
                resultTrackings,
                total,
                limit,
                offset,
            };

            this.logger.log(`Successfully found ${resultTrackings.length} ResultTrackings out of ${total} total`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to get ResultTrackings: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
