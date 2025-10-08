import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';

import { Ward } from '../../domain/ward.entity';
import { IWardRepository } from '../../domain/ward.interface';

@Injectable()
export class WardRepository implements IWardRepository {
    constructor(
        @InjectRepository(Ward)
        private readonly wardRepository: Repository<Ward>,
    ) { }

    async findById(id: string): Promise<Ward | null> {
        return this.wardRepository.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['province'],
        });
    }

    async findByCode(wardCode: string): Promise<Ward | null> {
        return this.wardRepository.findOne({
            where: { wardCode, deletedAt: IsNull() },
        });
    }

    async findByName(wardName: string): Promise<Ward | null> {
        return this.wardRepository.findOne({
            where: { wardName, deletedAt: IsNull() },
        });
    }

    async findByProvinceId(provinceId: string): Promise<Ward[]> {
        return this.wardRepository.find({
            where: { provinceId, deletedAt: IsNull() },
            relations: ['province'],
            order: { wardName: 'ASC' },
        });
    }

    async save(ward: Ward): Promise<Ward> {
        return this.wardRepository.save(ward);
    }

    async delete(id: string): Promise<void> {
        await this.wardRepository.softDelete(id);
    }

    async findActiveWards(limit: number, offset: number): Promise<[Ward[], number]> {
        return this.wardRepository.findAndCount({
            where: { isActiveFlag: 1, deletedAt: IsNull() },
            relations: ['province'],
            take: limit,
            skip: offset,
            order: { wardName: 'ASC' },
        });
    }

    async findAllWards(limit: number, offset: number): Promise<[Ward[], number]> {
        return this.wardRepository.findAndCount({
            where: { deletedAt: IsNull() },
            relations: ['province'],
            take: limit,
            skip: offset,
            order: { wardName: 'ASC' },
        });
    }

    async searchWards(searchTerm: string, limit: number, offset: number): Promise<[Ward[], number]> {
        return this.wardRepository.findAndCount({
            where: [
                { wardName: Like(`%${searchTerm}%`), deletedAt: IsNull() },
                { wardCode: Like(`%${searchTerm}%`), deletedAt: IsNull() },
            ],
            relations: ['province'],
            take: limit,
            skip: offset,
            order: { wardName: 'ASC' },
        });
    }

    async findWardsByProvince(provinceId: string, limit: number, offset: number): Promise<[Ward[], number]> {
        return this.wardRepository.findAndCount({
            where: { provinceId, deletedAt: IsNull() },
            relations: ['province'],
            take: limit,
            skip: offset,
            order: { wardName: 'ASC' },
        });
    }
}
