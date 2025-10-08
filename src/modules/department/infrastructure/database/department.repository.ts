import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { Department } from '../../domain/department.entity';
import { IDepartmentRepository } from '../../domain/department.interface';

@Injectable()
export class DepartmentRepository implements IDepartmentRepository {
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>,
    ) { }

    async findById(id: string): Promise<Department | null> {
        return this.departmentRepository.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['branch', 'departmentType', 'parentDepartment', 'subDepartments'],
        });
    }

    async findByCode(departmentCode: string): Promise<Department | null> {
        return this.departmentRepository.findOne({
            where: { departmentCode, deletedAt: IsNull() },
        });
    }

    async findByName(departmentName: string): Promise<Department | null> {
        return this.departmentRepository.findOne({
            where: { departmentName, deletedAt: IsNull() },
        });
    }

    async save(department: Department): Promise<Department> {
        return this.departmentRepository.save(department);
    }

    async delete(id: string): Promise<void> {
        await this.departmentRepository.softDelete(id);
    }

    async findAllDepartments(limit: number, offset: number): Promise<[Department[], number]> {
        return this.departmentRepository.findAndCount({
            where: { deletedAt: IsNull() },
            relations: ['branch', 'departmentType', 'parentDepartment'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findActiveDepartments(limit: number, offset: number): Promise<[Department[], number]> {
        return this.departmentRepository.findAndCount({
            where: { isActiveFlag: 1, deletedAt: IsNull() },
            relations: ['branch', 'departmentType', 'parentDepartment'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findDepartmentsByBranch(branchId: string, limit: number, offset: number): Promise<[Department[], number]> {
        return this.departmentRepository.findAndCount({
            where: { branchId, deletedAt: IsNull() },
            relations: ['branch', 'departmentType', 'parentDepartment'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findDepartmentsByType(departmentTypeId: string, limit: number, offset: number): Promise<[Department[], number]> {
        return this.departmentRepository.findAndCount({
            where: { departmentTypeId, deletedAt: IsNull() },
            relations: ['branch', 'departmentType', 'parentDepartment'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findDepartmentsByParent(parentDepartmentId: string, limit: number, offset: number): Promise<[Department[], number]> {
        return this.departmentRepository.findAndCount({
            where: { parentDepartmentId, deletedAt: IsNull() },
            relations: ['branch', 'departmentType', 'parentDepartment'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findParentDepartments(limit: number, offset: number): Promise<[Department[], number]> {
        return this.departmentRepository.findAndCount({
            where: { parentDepartmentId: IsNull(), deletedAt: IsNull() },
            relations: ['branch', 'departmentType'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findSubDepartments(parentDepartmentId: string, limit: number, offset: number): Promise<[Department[], number]> {
        return this.departmentRepository.findAndCount({
            where: { parentDepartmentId, deletedAt: IsNull() },
            relations: ['branch', 'departmentType', 'parentDepartment'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async searchDepartments(searchTerm: string, limit: number, offset: number): Promise<[Department[], number]> {
        const queryBuilder = this.departmentRepository
            .createQueryBuilder('department')
            .leftJoinAndSelect('department.branch', 'branch')
            .leftJoinAndSelect('department.departmentType', 'departmentType')
            .leftJoinAndSelect('department.parentDepartment', 'parentDepartment')
            .where('department.deletedAt IS NULL')
            .andWhere(
                '(department.departmentName ILIKE :search OR department.departmentCode ILIKE :search OR department.shortName ILIKE :search)',
                { search: `%${searchTerm}%` }
            )
            .orderBy('department.createdAt', 'DESC')
            .limit(limit)
            .offset(offset);

        return queryBuilder.getManyAndCount();
    }
}
