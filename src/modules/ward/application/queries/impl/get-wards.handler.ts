import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { GetWardsQuery } from '../get-wards.query';
import { Ward } from '../../../domain/ward.entity';
import { IWardRepository } from '../../../domain/ward.interface';

export interface WardResponseDto {
    id: string;
    wardCode: string;
    wardName: string;
    provinceId: string;
    province?: {
        id: string;
        provinceCode: string;
        provinceName: string;
    };
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetWardsResult {
    items: WardResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

@QueryHandler(GetWardsQuery)
export class GetWardsHandler implements IQueryHandler<GetWardsQuery> {
    private readonly logger = new Logger(GetWardsHandler.name);

    constructor(
        @Inject('IWardRepository')
        private readonly wardRepository: IWardRepository,
    ) {}

    async execute(query: GetWardsQuery): Promise<GetWardsResult> {
        const { getWardsDto } = query;
        const { limit = 10, offset = 0, search, provinceId, isActive } = getWardsDto;

        this.logger.log(`Getting wards with limit: ${limit}, offset: ${offset}, search: ${search}, provinceId: ${provinceId}`);

        let wards: Ward[];
        let total: number;

        if (provinceId) {
            // Get wards by province
            [wards, total] = await this.wardRepository.findWardsByProvince(provinceId, limit, offset);
        } else if (search) {
            // Search wards by name or code
            [wards, total] = await this.wardRepository.searchWards(search, limit, offset);
        } else if (isActive !== undefined) {
            // Filter by active status
            if (isActive) {
                [wards, total] = await this.wardRepository.findActiveWards(limit, offset);
            } else {
                [wards, total] = await this.wardRepository.findAllWards(limit, offset);
            }
        } else {
            // Get all wards
            [wards, total] = await this.wardRepository.findAllWards(limit, offset);
        }

        const items: WardResponseDto[] = wards.map(ward => ({
            id: ward.id,
            wardCode: ward.wardCode,
            wardName: ward.wardName,
            provinceId: ward.provinceId,
            province: ward.province ? {
                id: ward.province.id,
                provinceCode: ward.province.provinceCode,
                provinceName: ward.province.provinceName,
            } : undefined,
            isActive: ward.isActive,
            createdAt: ward.createdAt,
            updatedAt: ward.updatedAt,
        }));

        return {
            items,
            total,
            limit,
            offset,
        };
    }
}
