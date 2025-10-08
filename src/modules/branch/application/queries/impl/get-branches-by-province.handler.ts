import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { GetBranchesByProvinceQuery } from '../get-branches-by-province.query';
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

export interface GetBranchesByProvinceResult {
    items: BranchResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

@QueryHandler(GetBranchesByProvinceQuery)
export class GetBranchesByProvinceHandler implements IQueryHandler<GetBranchesByProvinceQuery> {
    private readonly logger = new Logger(GetBranchesByProvinceHandler.name);

    constructor(
        @Inject('IBranchRepository')
        private readonly branchRepository: IBranchRepository,
    ) { }

    async execute(query: GetBranchesByProvinceQuery): Promise<GetBranchesByProvinceResult> {
        const { provinceId, limit, offset } = query;
        this.logger.log(`Getting branches by province: ${provinceId}`);

        const [branches, total] = await this.branchRepository.findBranchesByProvince(provinceId, limit, offset);

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
