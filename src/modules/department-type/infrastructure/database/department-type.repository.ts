import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { DepartmentType } from '../../domain/department-type.entity';
import { IDepartmentTypeRepository } from '../../domain/department-type.interface';

@Injectable()
export class DepartmentTypeRepository implements IDepartmentTypeRepository {
    constructor(
        @InjectRepository(DepartmentType)
        private readonly departmentTypeRepository: Repository<DepartmentType>,
    ) { }

    async findById(id: string): Promise<DepartmentType | null> {
        return this.departmentTypeRepository.findOne({
            where: { id, deletedAt: IsNull() },
        });
    }

    async findByCode(typeCode: string): Promise<DepartmentType | null> {
        return this.departmentTypeRepository.findOne({
            where: { typeCode, deletedAt: IsNull() },
        });
    }

    async findByName(typeName: string): Promise<DepartmentType | null> {
        return this.departmentTypeRepository.findOne({
            where: { typeName, deletedAt: IsNull() },
        });
    }

    async save(departmentType: DepartmentType): Promise<DepartmentType> {
        return this.departmentTypeRepository.save(departmentType);
    }

    async delete(id: string): Promise<void> {
        await this.departmentTypeRepository.softDelete(id);
    }

    async findAllDepartmentTypes(limit: number, offset: number): Promise<[DepartmentType[], number]> {
        return this.departmentTypeRepository.findAndCount({
            where: { deletedAt: IsNull() },
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findActiveDepartmentTypes(limit: number, offset: number): Promise<[DepartmentType[], number]> {
        return this.departmentTypeRepository.findAndCount({
            where: { isActiveFlag: 1, deletedAt: IsNull() },
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async searchDepartmentTypes(searchTerm: string, limit: number, offset: number): Promise<[DepartmentType[], number]> {
        const queryBuilder = this.departmentTypeRepository
            .createQueryBuilder('departmentType')
            .where('departmentType.deletedAt IS NULL')
            .andWhere(
                '(departmentType.typeName ILIKE :search OR departmentType.typeCode ILIKE :search)',
                { search: `%${searchTerm}%` }
            )
            .orderBy('departmentType.createdAt', 'DESC')
            .limit(limit)
            .offset(offset);

        return queryBuilder.getManyAndCount();
    }
}
