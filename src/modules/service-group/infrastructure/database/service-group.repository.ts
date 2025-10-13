import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';
import { ServiceGroup } from '../../domain/service-group.entity';
import { IServiceGroupRepository } from '../../domain/service-group.interface';

@Injectable()
export class ServiceGroupRepository implements IServiceGroupRepository {
    constructor(
        @InjectRepository(ServiceGroup)
        private readonly serviceGroupRepository: Repository<ServiceGroup>,
    ) { }

    async findById(id: string): Promise<ServiceGroup | null> {
        return this.serviceGroupRepository
            .createQueryBuilder('serviceGroup')
            .where('serviceGroup.id = :id', { id })
            .andWhere('serviceGroup.deletedAt IS NULL')
            .getOne();
    }

    async findByCode(serviceGroupCode: string): Promise<ServiceGroup | null> {
        return this.serviceGroupRepository
            .createQueryBuilder('serviceGroup')
            .where('serviceGroup.serviceGroupCode = :serviceGroupCode', { serviceGroupCode })
            .andWhere('serviceGroup.deletedAt IS NULL')
            .getOne();
    }

    async findByName(serviceGroupName: string): Promise<ServiceGroup | null> {
        return this.serviceGroupRepository
            .createQueryBuilder('serviceGroup')
            .where('serviceGroup.serviceGroupName = :serviceGroupName', { serviceGroupName })
            .andWhere('serviceGroup.deletedAt IS NULL')
            .getOne();
    }

    async save(serviceGroup: ServiceGroup): Promise<ServiceGroup> {
        return this.serviceGroupRepository.save(serviceGroup);
    }

    async delete(id: string): Promise<void> {
        await this.serviceGroupRepository.softDelete(id);
    }

    async findAndCount(limit: number, offset: number, search?: string): Promise<[ServiceGroup[], number]> {
        const queryBuilder = this.serviceGroupRepository
            .createQueryBuilder('serviceGroup')
            .where('serviceGroup.deletedAt IS NULL')
            .orderBy('serviceGroup.createdAt', 'DESC')
            .limit(limit)
            .offset(offset);

        if (search) {
            queryBuilder.andWhere(
                '(serviceGroup.serviceGroupCode LIKE :search OR serviceGroup.serviceGroupName LIKE :search OR serviceGroup.shortName LIKE :search)',
                { search: `%${search}%` }
            );
        }

        return queryBuilder.getManyAndCount();
    }

    async findActiveServiceGroups(limit: number, offset: number): Promise<[ServiceGroup[], number]> {
        return this.serviceGroupRepository
            .createQueryBuilder('serviceGroup')
            .where('serviceGroup.deletedAt IS NULL')
            .orderBy('serviceGroup.createdAt', 'DESC')
            .limit(limit)
            .offset(offset)
            .getManyAndCount();
    }
}
