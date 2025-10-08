import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { GetBranchByIdQuery } from '../get-branch-by-id.query';
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

@QueryHandler(GetBranchByIdQuery)
export class GetBranchByIdHandler implements IQueryHandler<GetBranchByIdQuery> {
    private readonly logger = new Logger(GetBranchByIdHandler.name);

    constructor(
        @Inject('IBranchRepository')
        private readonly branchRepository: IBranchRepository,
    ) { }

    async execute(query: GetBranchByIdQuery): Promise<BranchResponseDto> {
        const { id } = query;
        this.logger.log(`Getting branch by ID: ${id}`);

        const branch = await this.branchRepository.findById(id);
        if (!branch) {
            throw new NotFoundException('Branch not found');
        }

        return {
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
        };
    }
}
