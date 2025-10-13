import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';
import { UnitOfMeasure } from '../../domain/unit-of-measure.entity';
import { IUnitOfMeasureRepository } from '../../domain/unit-of-measure.interface';

@Injectable()
export class UnitOfMeasureRepository implements IUnitOfMeasureRepository {
    constructor(
        @InjectRepository(UnitOfMeasure)
        private readonly unitOfMeasureRepository: Repository<UnitOfMeasure>,
    ) { }

    async findById(id: string): Promise<UnitOfMeasure | null> {
        return this.unitOfMeasureRepository
            .createQueryBuilder('unitOfMeasure')
            .where('unitOfMeasure.id = :id', { id })
            .andWhere('unitOfMeasure.deletedAt IS NULL')
            .getOne();
    }

    async findByCode(unitOfMeasureCode: string): Promise<UnitOfMeasure | null> {
        return this.unitOfMeasureRepository
            .createQueryBuilder('unitOfMeasure')
            .where('unitOfMeasure.unitOfMeasureCode = :unitOfMeasureCode', { unitOfMeasureCode })
            .andWhere('unitOfMeasure.deletedAt IS NULL')
            .getOne();
    }

    async findByName(unitOfMeasureName: string): Promise<UnitOfMeasure | null> {
        return this.unitOfMeasureRepository
            .createQueryBuilder('unitOfMeasure')
            .where('unitOfMeasure.unitOfMeasureName = :unitOfMeasureName', { unitOfMeasureName })
            .andWhere('unitOfMeasure.deletedAt IS NULL')
            .getOne();
    }

    async save(unitOfMeasure: UnitOfMeasure): Promise<UnitOfMeasure> {
        return this.unitOfMeasureRepository.save(unitOfMeasure);
    }

    async delete(id: string): Promise<void> {
        await this.unitOfMeasureRepository.softDelete(id);
    }

    async findAndCount(
        limit: number,
        offset: number,
        search?: string,
        isActive?: boolean,
    ): Promise<[UnitOfMeasure[], number]> {
        const queryBuilder = this.unitOfMeasureRepository.createQueryBuilder('unitOfMeasure');

        queryBuilder.where('unitOfMeasure.deletedAt IS NULL');

        if (search) {
            queryBuilder.andWhere(
                '(unitOfMeasure.unitOfMeasureCode LIKE :search OR unitOfMeasure.unitOfMeasureName LIKE :search)',
                { search: `%${search}%` },
            );
        }

        if (typeof isActive === 'boolean') {
            queryBuilder.andWhere('unitOfMeasure.isActiveFlag = :isActive', { isActive: isActive ? 1 : 0 });
        }

        queryBuilder.orderBy('unitOfMeasure.createdAt', 'DESC');
        queryBuilder.take(limit);
        queryBuilder.skip(offset);

        return queryBuilder.getManyAndCount();
    }

    async findActiveUnitOfMeasures(limit: number, offset: number): Promise<[UnitOfMeasure[], number]> {
        return this.unitOfMeasureRepository
            .createQueryBuilder('unitOfMeasure')
            .where('unitOfMeasure.deletedAt IS NULL')
            .andWhere('unitOfMeasure.isActiveFlag = :isActive', { isActive: 1 })
            .orderBy('unitOfMeasure.createdAt', 'DESC')
            .limit(limit)
            .offset(offset)
            .getManyAndCount();
    }
}
