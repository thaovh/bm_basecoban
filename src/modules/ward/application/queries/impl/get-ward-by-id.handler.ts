import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { GetWardByIdQuery } from '../get-ward-by-id.query';
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

@QueryHandler(GetWardByIdQuery)
export class GetWardByIdHandler implements IQueryHandler<GetWardByIdQuery> {
    private readonly logger = new Logger(GetWardByIdHandler.name);

    constructor(
        @Inject('IWardRepository')
        private readonly wardRepository: IWardRepository,
    ) { }

    async execute(query: GetWardByIdQuery): Promise<WardResponseDto> {
        const { id } = query;
        this.logger.log(`Getting ward by id: ${id}`);

        const ward = await this.wardRepository.findById(id);
        if (!ward) {
            throw new NotFoundException('Ward not found');
        }

        return {
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
        };
    }
}
