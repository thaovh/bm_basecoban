import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ResultStatus } from '../../domain/result-status.entity';
import { IResultStatusRepository } from '../../domain/result-status.interface';

@Injectable()
export class ResultStatusRepository implements IResultStatusRepository {
    private readonly logger = new Logger(ResultStatusRepository.name);

    constructor(
        @InjectRepository(ResultStatus)
        private readonly resultStatusRepository: Repository<ResultStatus>,
    ) {}

    async findById(id: string): Promise<ResultStatus | null> {
        try {
            return await this.resultStatusRepository.findOne({
                where: { id, deletedAt: IsNull() },
            });
        } catch (error) {
            this.logger.error(`Error finding ResultStatus by ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async findByCode(statusCode: string): Promise<ResultStatus | null> {
        try {
            return await this.resultStatusRepository.findOne({
                where: { statusCode, deletedAt: IsNull() },
            });
        } catch (error) {
            this.logger.error(`Error finding ResultStatus by code ${statusCode}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async findAll(limit: number = 10, offset: number = 0): Promise<[ResultStatus[], number]> {
        try {
            return await this.resultStatusRepository.findAndCount({
                where: { deletedAt: IsNull() },
                take: limit,
                skip: offset,
                order: { orderNumber: 'ASC', createdAt: 'DESC' },
            });
        } catch (error) {
            this.logger.error(`Error finding all ResultStatuses: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async findActive(limit: number = 10, offset: number = 0): Promise<[ResultStatus[], number]> {
        try {
            return await this.resultStatusRepository.findAndCount({
                where: { isActiveFlag: 1, deletedAt: IsNull() },
                take: limit,
                skip: offset,
                order: { orderNumber: 'ASC', createdAt: 'DESC' },
            });
        } catch (error) {
            this.logger.error(`Error finding active ResultStatuses: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async findByOrderRange(minOrder: number, maxOrder: number): Promise<ResultStatus[]> {
        try {
            return await this.resultStatusRepository
                .createQueryBuilder('resultStatus')
                .where('resultStatus.deletedAt IS NULL')
                .andWhere('resultStatus.orderNumber >= :minOrder', { minOrder })
                .andWhere('resultStatus.orderNumber <= :maxOrder', { maxOrder })
                .orderBy('resultStatus.orderNumber', 'ASC')
                .getMany();
        } catch (error) {
            this.logger.error(`Error finding ResultStatuses by order range ${minOrder}-${maxOrder}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async save(resultStatus: ResultStatus): Promise<ResultStatus> {
        try {
            return await this.resultStatusRepository.save(resultStatus);
        } catch (error) {
            this.logger.error(`Error saving ResultStatus: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async update(id: string, resultStatus: Partial<ResultStatus>): Promise<ResultStatus> {
        try {
            await this.resultStatusRepository.update(id, resultStatus);
            const updated = await this.findById(id);
            if (!updated) {
                throw new Error(`ResultStatus with ID ${id} not found after update`);
            }
            return updated;
        } catch (error) {
            this.logger.error(`Error updating ResultStatus ${id}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.resultStatusRepository.delete(id);
        } catch (error) {
            this.logger.error(`Error deleting ResultStatus ${id}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async softDelete(id: string): Promise<void> {
        try {
            await this.resultStatusRepository.softDelete(id);
        } catch (error) {
            this.logger.error(`Error soft deleting ResultStatus ${id}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async search(searchTerm: string, limit: number = 10, offset: number = 0): Promise<[ResultStatus[], number]> {
        try {
            const queryBuilder = this.resultStatusRepository
                .createQueryBuilder('resultStatus')
                .where('resultStatus.deletedAt IS NULL')
                .andWhere(
                    '(resultStatus.statusCode ILIKE :searchTerm OR resultStatus.statusName ILIKE :searchTerm OR resultStatus.description ILIKE :searchTerm)',
                    { searchTerm: `%${searchTerm}%` }
                )
                .orderBy('resultStatus.orderNumber', 'ASC')
                .addOrderBy('resultStatus.createdAt', 'DESC')
                .take(limit)
                .skip(offset);

            return await queryBuilder.getManyAndCount();
        } catch (error) {
            this.logger.error(`Error searching ResultStatuses with term "${searchTerm}": ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
