import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { GetProvincesQuery } from '../get-provinces.query';
import { Province } from '../../../domain/province.entity';
import { IProvinceRepository } from '../../../domain/province.interface';

export interface ProvinceResponseDto {
    id: string;
    provinceCode: string;
    provinceName: string;
    shortName?: string;
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetProvincesResult {
    items: ProvinceResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

@QueryHandler(GetProvincesQuery)
export class GetProvincesHandler implements IQueryHandler<GetProvincesQuery> {
    private readonly logger = new Logger(GetProvincesHandler.name);

    constructor(
        @Inject('IProvinceRepository')
        private readonly provinceRepository: IProvinceRepository,
    ) { }

    async execute(query: GetProvincesQuery): Promise<GetProvincesResult> {
        const { getProvincesDto } = query;
        const { limit = 10, offset = 0, search, isActive } = getProvincesDto;

        this.logger.log(`Getting provinces with limit: ${limit}, offset: ${offset}, search: ${search}`);

        let provinces: Province[];
        let total: number;

        if (search) {
            // Search provinces by name or code
            [provinces, total] = await this.provinceRepository.searchProvinces(search, limit, offset);
        } else if (isActive !== undefined) {
            // Filter by active status
            if (isActive) {
                [provinces, total] = await this.provinceRepository.findActiveProvinces(limit, offset);
            } else {
                [provinces, total] = await this.provinceRepository.findAllProvinces(limit, offset);
            }
        } else {
            // Get all provinces
            [provinces, total] = await this.provinceRepository.findAllProvinces(limit, offset);
        }

        const items: ProvinceResponseDto[] = provinces.map(province => ({
            id: province.id,
            provinceCode: province.provinceCode,
            provinceName: province.provinceName,
            shortName: province.shortName,
            isActive: province.isActiveFlag,
            createdAt: province.createdAt,
            updatedAt: province.updatedAt,
        }));

        return {
            items,
            total,
            limit,
            offset,
        };
    }
}
