import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { GetProvinceByIdQuery } from '../get-province-by-id.query';
import { Province } from '../../../domain/province.entity';
import { IProvinceRepository } from '../../../domain/province.interface';

export interface ProvinceResponseDto {
    id: string;
    provinceCode: string;
    provinceName: string;
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
}

@QueryHandler(GetProvinceByIdQuery)
export class GetProvinceByIdHandler implements IQueryHandler<GetProvinceByIdQuery> {
    private readonly logger = new Logger(GetProvinceByIdHandler.name);

    constructor(
        @Inject('IProvinceRepository')
        private readonly provinceRepository: IProvinceRepository,
    ) { }

    async execute(query: GetProvinceByIdQuery): Promise<ProvinceResponseDto> {
        const { id } = query;
        this.logger.log(`Getting province by id: ${id}`);

        const province = await this.provinceRepository.findById(id);
        if (!province) {
            throw new NotFoundException('Province not found');
        }

        return {
            id: province.id,
            provinceCode: province.provinceCode,
            provinceName: province.provinceName,
            isActive: province.isActive,
            createdAt: province.createdAt,
            updatedAt: province.updatedAt,
        };
    }
}
