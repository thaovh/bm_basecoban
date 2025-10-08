import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { Branch } from '../../domain/branch.entity';
import { IBranchRepository } from '../../domain/branch.interface';

@Injectable()
export class BranchRepository implements IBranchRepository {
    constructor(
        @InjectRepository(Branch)
        private readonly branchRepository: Repository<Branch>,
    ) { }

    async findById(id: string): Promise<Branch | null> {
        return this.branchRepository.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['province', 'ward'],
        });
    }

    async findByCode(branchCode: string): Promise<Branch | null> {
        return this.branchRepository.findOne({
            where: { branchCode, deletedAt: IsNull() },
        });
    }

    async findByName(branchName: string): Promise<Branch | null> {
        return this.branchRepository.findOne({
            where: { branchName, deletedAt: IsNull() },
        });
    }

    async save(branch: Branch): Promise<Branch> {
        return this.branchRepository.save(branch);
    }

    async delete(id: string): Promise<void> {
        await this.branchRepository.softDelete(id);
    }

    async findAllBranches(limit: number, offset: number): Promise<[Branch[], number]> {
        return this.branchRepository.findAndCount({
            where: { deletedAt: IsNull() },
            relations: ['province', 'ward'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findActiveBranches(limit: number, offset: number): Promise<[Branch[], number]> {
        return this.branchRepository.findAndCount({
            where: { isActiveFlag: 1, deletedAt: IsNull() },
            relations: ['province', 'ward'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findBranchesByProvince(provinceId: string, limit: number, offset: number): Promise<[Branch[], number]> {
        return this.branchRepository.findAndCount({
            where: { provinceId, deletedAt: IsNull() },
            relations: ['province', 'ward'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findBranchesByWard(wardId: string, limit: number, offset: number): Promise<[Branch[], number]> {
        return this.branchRepository.findAndCount({
            where: { wardId, deletedAt: IsNull() },
            relations: ['province', 'ward'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async searchBranches(searchTerm: string, limit: number, offset: number): Promise<[Branch[], number]> {
        const queryBuilder = this.branchRepository
            .createQueryBuilder('branch')
            .leftJoinAndSelect('branch.province', 'province')
            .leftJoinAndSelect('branch.ward', 'ward')
            .where('branch.deletedAt IS NULL')
            .andWhere(
                '(branch.branchName ILIKE :search OR branch.branchCode ILIKE :search OR branch.shortName ILIKE :search)',
                { search: `%${searchTerm}%` }
            )
            .orderBy('branch.createdAt', 'DESC')
            .limit(limit)
            .offset(offset);

        return queryBuilder.getManyAndCount();
    }
}
