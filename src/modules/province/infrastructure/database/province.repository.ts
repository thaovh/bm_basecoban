import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';

import { Province } from '../../domain/province.entity';
import { IProvinceRepository } from '../../domain/province.interface';

@Injectable()
export class ProvinceRepository implements IProvinceRepository {
    constructor(
        @InjectRepository(Province)
        private readonly provinceRepository: Repository<Province>,
    ) { }

    async findById(id: string): Promise<Province | null> {
        return this.provinceRepository.findOne({
            where: { id, deletedAt: IsNull() },
        });
    }

    async findByCode(provinceCode: string): Promise<Province | null> {
        return this.provinceRepository.findOne({
            where: { provinceCode, deletedAt: IsNull() },
        });
    }

    async findByName(provinceName: string): Promise<Province | null> {
        return this.provinceRepository.findOne({
            where: { provinceName, deletedAt: IsNull() },
        });
    }

    async save(province: Province): Promise<Province> {
        return this.provinceRepository.save(province);
    }

    async delete(id: string): Promise<void> {
        await this.provinceRepository.softDelete(id);
    }

    async findActiveProvinces(limit: number, offset: number): Promise<[Province[], number]> {
        return this.provinceRepository.findAndCount({
            where: { isActiveFlag: 1, deletedAt: IsNull() },
            take: limit,
            skip: offset,
            order: { provinceName: 'ASC' },
        });
    }

    async findAllProvinces(limit: number, offset: number): Promise<[Province[], number]> {
        return this.provinceRepository.findAndCount({
            where: { deletedAt: IsNull() },
            take: limit,
            skip: offset,
            order: { provinceName: 'ASC' },
        });
    }

    async searchProvinces(searchTerm: string, limit: number, offset: number): Promise<[Province[], number]> {
        return this.provinceRepository.findAndCount({
            where: [
                { provinceName: Like(`%${searchTerm}%`), deletedAt: IsNull() },
                { provinceCode: Like(`%${searchTerm}%`), deletedAt: IsNull() },
            ],
            take: limit,
            skip: offset,
            order: { provinceName: 'ASC' },
        });
    }
}
