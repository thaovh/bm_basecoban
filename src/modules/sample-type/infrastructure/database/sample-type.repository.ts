import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { SampleType } from '../../domain/sample-type.entity';
import { ISampleTypeRepository } from '../../domain/sample-type.interface';

@Injectable()
export class SampleTypeRepository implements ISampleTypeRepository {
    constructor(
        @InjectRepository(SampleType)
        private readonly sampleTypeRepository: Repository<SampleType>,
    ) { }

    async findById(id: string): Promise<SampleType | null> {
        return this.sampleTypeRepository.findOne({
            where: { id, deletedAt: IsNull() },
        });
    }

    async findByCode(typeCode: string): Promise<SampleType | null> {
        return this.sampleTypeRepository.findOne({
            where: { typeCode, deletedAt: IsNull() },
        });
    }

    async findByName(typeName: string): Promise<SampleType | null> {
        return this.sampleTypeRepository.findOne({
            where: { typeName, deletedAt: IsNull() },
        });
    }

    async save(sampleType: SampleType): Promise<SampleType> {
        return this.sampleTypeRepository.save(sampleType);
    }

    async delete(id: string): Promise<void> {
        await this.sampleTypeRepository.softDelete(id);
    }

    async findAllSampleTypes(limit: number, offset: number): Promise<[SampleType[], number]> {
        return this.sampleTypeRepository.findAndCount({
            where: { deletedAt: IsNull() },
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findActiveSampleTypes(limit: number, offset: number): Promise<[SampleType[], number]> {
        return this.sampleTypeRepository.findAndCount({
            where: { isActiveFlag: 1, deletedAt: IsNull() },
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async searchSampleTypes(searchTerm: string, limit: number, offset: number): Promise<[SampleType[], number]> {
        const queryBuilder = this.sampleTypeRepository
            .createQueryBuilder('sampleType')
            .where('sampleType.deletedAt IS NULL')
            .andWhere(
                '(sampleType.typeName ILIKE :search OR sampleType.typeCode ILIKE :search OR sampleType.shortName ILIKE :search)',
                { search: `%${searchTerm}%` }
            )
            .orderBy('sampleType.createdAt', 'DESC')
            .limit(limit)
            .offset(offset);

        return queryBuilder.getManyAndCount();
    }
}
