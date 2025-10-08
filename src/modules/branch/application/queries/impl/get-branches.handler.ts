import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { GetBranchesQuery } from '../get-branches.query';
import { Branch } from '../../../domain/branch.entity';
import { IBranchRepository } from '../../../domain/branch.interface';

export interface BranchResponseDto {
    id: string;
    branchCode: string;
    branchName: string;
    shortName?: string;
    provinceId: string;
    wardId: string;
    address: string;
    phoneNumber?: string;
    hospitalLevel?: string;
    representative?: string;
    bhytCode?: string;
    province?: {
        id: string;
        provinceCode: string;
        provinceName: string;
    };
    ward?: {
        id: string;
        wardCode: string;
        wardName: string;
    };
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetBranchesResult {
    items: BranchResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

@QueryHandler(GetBranchesQuery)
export class GetBranchesHandler implements IQueryHandler<GetBranchesQuery> {
    private readonly logger = new Logger(GetBranchesHandler.name);

    constructor(
        @Inject('IBranchRepository')
        private readonly branchRepository: IBranchRepository,
    ) { }

    async execute(query: GetBranchesQuery): Promise<GetBranchesResult> {
        const { getBranchesDto } = query;
        const { search, provinceId, wardId, hospitalLevel, isActive, limit = 10, offset = 0 } = getBranchesDto;

        this.logger.log(`Getting branches with filters: search=${search}, provinceId=${provinceId}, wardId=${wardId}, hospitalLevel=${hospitalLevel}, isActive=${isActive}`);

        let branches: Branch[];
        let total: number;

        if (search) {
            // Search branches by name or code
            [branches, total] = await this.branchRepository.searchBranches(search, limit, offset);
        } else if (provinceId) {
            // Get branches by province
            [branches, total] = await this.branchRepository.findBranchesByProvince(provinceId, limit, offset);
        } else if (wardId) {
            // Get branches by ward
            [branches, total] = await this.branchRepository.findBranchesByWard(wardId, limit, offset);
        } else if (isActive !== undefined) {
            // Filter by active status
            if (isActive) {
                [branches, total] = await this.branchRepository.findActiveBranches(limit, offset);
            } else {
                [branches, total] = await this.branchRepository.findAllBranches(limit, offset);
            }
        } else {
            // Get all branches
            [branches, total] = await this.branchRepository.findAllBranches(limit, offset);
        }

        // Filter by hospital level if specified
        if (hospitalLevel && branches) {
            branches = branches.filter(branch => branch.hospitalLevel === hospitalLevel);
            total = branches.length;
        }

        const items: BranchResponseDto[] = branches.map(branch => ({
            id: branch.id,
            branchCode: branch.branchCode,
            branchName: branch.branchName,
            shortName: branch.shortName,
            provinceId: branch.provinceId,
            wardId: branch.wardId,
            address: branch.address,
            phoneNumber: branch.phoneNumber,
            hospitalLevel: branch.hospitalLevel,
            representative: branch.representative,
            bhytCode: branch.bhytCode,
            province: branch.province ? {
                id: branch.province.id,
                provinceCode: branch.province.provinceCode,
                provinceName: branch.province.provinceName,
            } : undefined,
            ward: branch.ward ? {
                id: branch.ward.id,
                wardCode: branch.ward.wardCode,
                wardName: branch.ward.wardName,
            } : undefined,
            isActive: branch.isActiveFlag,
            createdAt: branch.createdAt,
            updatedAt: branch.updatedAt,
        }));

        return {
            items,
            total,
            limit,
            offset,
        };
    }
}
