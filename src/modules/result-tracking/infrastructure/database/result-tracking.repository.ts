import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThan, LessThan, Between } from 'typeorm';
import { ResultTracking } from '../../domain/result-tracking.entity';
import { IResultTrackingRepository } from '../../domain/result-tracking.interface';

@Injectable()
export class ResultTrackingRepository implements IResultTrackingRepository {
    private readonly logger = new Logger(ResultTrackingRepository.name);

    constructor(
        @InjectRepository(ResultTracking)
        private readonly resultTrackingRepository: Repository<ResultTracking>,
    ) { }

    async findById(id: string): Promise<ResultTracking | null> {
        try {
            return await this.resultTrackingRepository.findOne({
                where: { id, deletedAt: IsNull() },
                relations: ['serviceRequest', 'resultStatus', 'room'],
            });
        } catch (error) {
            this.logger.error(`Error finding ResultTracking by ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async findByServiceRequestId(serviceRequestId: string): Promise<ResultTracking[]> {
        try {
            return await this.resultTrackingRepository.find({
                where: { serviceRequestId, deletedAt: IsNull() },
                relations: ['serviceRequest', 'resultStatus', 'room'],
                order: { inTrackingTime: 'DESC' },
            });
        } catch (error) {
            this.logger.error(`Error finding ResultTrackings by ServiceRequest ID ${serviceRequestId}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async findByResultStatusId(resultStatusId: string): Promise<ResultTracking[]> {
        try {
            return await this.resultTrackingRepository.find({
                where: { resultStatusId, deletedAt: IsNull() },
                relations: ['serviceRequest', 'resultStatus', 'room'],
                order: { inTrackingTime: 'DESC' },
            });
        } catch (error) {
            this.logger.error(`Error finding ResultTrackings by ResultStatus ID ${resultStatusId}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async findByRoomId(roomId: string): Promise<ResultTracking[]> {
        try {
            return await this.resultTrackingRepository.find({
                where: { roomId, deletedAt: IsNull() },
                relations: ['serviceRequest', 'resultStatus', 'room'],
                order: { inTrackingTime: 'DESC' },
            });
        } catch (error) {
            this.logger.error(`Error finding ResultTrackings by Room ID ${roomId}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async findActiveInRoom(roomId: string): Promise<ResultTracking[]> {
        try {
            return await this.resultTrackingRepository.find({
                where: {
                    roomId,
                    deletedAt: IsNull(),
                    inTrackingTime: MoreThan(new Date(0)),
                    outTrackingTime: IsNull(),
                },
                relations: ['serviceRequest', 'resultStatus', 'room'],
                order: { inTrackingTime: 'ASC' },
            });
        } catch (error) {
            this.logger.error(`Error finding active ResultTrackings in Room ${roomId}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async findCurrentTrackingByServiceRequest(serviceRequestId: string): Promise<ResultTracking | null> {
        try {
            return await this.resultTrackingRepository.findOne({
                where: {
                    serviceRequestId,
                    deletedAt: IsNull(),
                    inTrackingTime: MoreThan(new Date(0)),
                    outTrackingTime: IsNull(),
                },
                relations: ['serviceRequest', 'resultStatus', 'room'],
                order: { inTrackingTime: 'DESC' },
            });
        } catch (error) {
            this.logger.error(`Error finding current tracking for ServiceRequest ${serviceRequestId}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async findAll(limit: number = 10, offset: number = 0): Promise<[ResultTracking[], number]> {
        try {
            return await this.resultTrackingRepository.findAndCount({
                where: { deletedAt: IsNull() },
                relations: ['serviceRequest', 'resultStatus', 'room'],
                take: limit,
                skip: offset,
                order: { inTrackingTime: 'DESC' },
            });
        } catch (error) {
            this.logger.error(`Error finding all ResultTrackings: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async save(resultTracking: ResultTracking): Promise<ResultTracking> {
        try {
            return await this.resultTrackingRepository.save(resultTracking);
        } catch (error) {
            this.logger.error(`Error saving ResultTracking: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async update(id: string, resultTracking: Partial<ResultTracking>): Promise<ResultTracking> {
        try {
            await this.resultTrackingRepository.update(id, resultTracking);
            const updated = await this.findById(id);
            if (!updated) {
                throw new Error(`ResultTracking with ID ${id} not found after update`);
            }
            return updated;
        } catch (error) {
            this.logger.error(`Error updating ResultTracking ${id}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.resultTrackingRepository.delete(id);
        } catch (error) {
            this.logger.error(`Error deleting ResultTracking ${id}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async softDelete(id: string): Promise<void> {
        try {
            await this.resultTrackingRepository.softDelete(id);
        } catch (error) {
            this.logger.error(`Error soft deleting ResultTracking ${id}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async search(searchTerm: string, limit: number = 10, offset: number = 0): Promise<[ResultTracking[], number]> {
        try {
            const queryBuilder = this.resultTrackingRepository
                .createQueryBuilder('tracking')
                .leftJoinAndSelect('tracking.serviceRequest', 'serviceRequest')
                .leftJoinAndSelect('tracking.resultStatus', 'resultStatus')
                .leftJoinAndSelect('tracking.room', 'room')
                .where('tracking.deletedAt IS NULL')
                .andWhere(
                    '(tracking.note ILIKE :searchTerm OR resultStatus.statusName ILIKE :searchTerm OR resultStatus.statusCode ILIKE :searchTerm OR room.roomName ILIKE :searchTerm)',
                    { searchTerm: `%${searchTerm}%` }
                )
                .orderBy('tracking.inTrackingTime', 'DESC')
                .take(limit)
                .skip(offset);

            return await queryBuilder.getManyAndCount();
        } catch (error) {
            this.logger.error(`Error searching ResultTrackings with term "${searchTerm}": ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async findByDateRange(startDate: Date, endDate: Date, limit: number = 10, offset: number = 0): Promise<[ResultTracking[], number]> {
        try {
            return await this.resultTrackingRepository.findAndCount({
                where: {
                    deletedAt: IsNull(),
                    inTrackingTime: Between(startDate, endDate),
                },
                relations: ['serviceRequest', 'resultStatus', 'room'],
                take: limit,
                skip: offset,
                order: { inTrackingTime: 'DESC' },
            });
        } catch (error) {
            this.logger.error(`Error finding ResultTrackings by date range ${startDate} - ${endDate}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async findOverdueTrackings(limit: number = 10, offset: number = 0): Promise<[ResultTracking[], number]> {
        try {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

            return await this.resultTrackingRepository.findAndCount({
                where: {
                    deletedAt: IsNull(),
                    inTrackingTime: LessThan(oneHourAgo),
                    outTrackingTime: IsNull(),
                },
                relations: ['serviceRequest', 'resultStatus', 'room'],
                take: limit,
                skip: offset,
                order: { inTrackingTime: 'ASC' },
            });
        } catch (error) {
            this.logger.error(`Error finding overdue ResultTrackings: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async getTrackingStatistics(serviceRequestId?: string, roomId?: string, resultStatusId?: string): Promise<any> {
        try {
            const queryBuilder = this.resultTrackingRepository
                .createQueryBuilder('tracking')
                .where('tracking.deletedAt IS NULL');

            if (serviceRequestId) {
                queryBuilder.andWhere('tracking.serviceRequestId = :serviceRequestId', { serviceRequestId });
            }
            if (roomId) {
                queryBuilder.andWhere('tracking.roomId = :roomId', { roomId });
            }
            if (resultStatusId) {
                queryBuilder.andWhere('tracking.resultStatusId = :resultStatusId', { resultStatusId });
            }

            const total = await queryBuilder.getCount();
            const active = await queryBuilder.clone()
                .andWhere('tracking.outTrackingTime IS NULL')
                .getCount();
            const completed = await queryBuilder.clone()
                .andWhere('tracking.outTrackingTime IS NOT NULL')
                .getCount();

            return {
                total,
                active,
                completed,
                completionRate: total > 0 ? (completed / total) * 100 : 0,
            };
        } catch (error) {
            this.logger.error(`Error getting tracking statistics: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
