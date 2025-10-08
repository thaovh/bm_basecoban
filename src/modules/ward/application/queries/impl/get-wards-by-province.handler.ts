import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { GetWardsByProvinceQuery } from '../get-wards-by-province.query';
import { Ward } from '../../../domain/ward.entity';
import { IWardRepository } from '../../../domain/ward.interface';

export interface WardResponseDto {
    id: string;
    wardCode: string;
    wardName: string;
    shortName?: string;
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

export interface GetWardsByProvinceResult {
    items: WardResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

@QueryHandler(GetWardsByProvinceQuery)
export class GetWardsByProvinceHandler implements IQueryHandler<GetWardsByProvinceQuery> {
    private readonly logger = new Logger(GetWardsByProvinceHandler.name);

    constructor(
        @Inject('IWardRepository')
        private readonly wardRepository: IWardRepository,
    ) { }

    async execute(query: GetWardsByProvinceQuery): Promise<GetWardsByProvinceResult> {
        const { provinceId, limit, offset } = query;
        this.logger.log(`Getting wards by province: ${provinceId}`);

        const [wards, total] = await this.wardRepository.findWardsByProvince(provinceId, limit, offset);

        const items: WardResponseDto[] = wards.map(ward => ({
            id: ward.id,
            wardCode: ward.wardCode,
            wardName: ward.wardName,
            shortName: ward.shortName,
            provinceId: ward.provinceId,
            province: ward.province ? {
                id: ward.province.id,
                provinceCode: ward.province.provinceCode,
                provinceName: ward.province.provinceName,
            } : undefined,
            isActive: ward.isActiveFlag,
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
