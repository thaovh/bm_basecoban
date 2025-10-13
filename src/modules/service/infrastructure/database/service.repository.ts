import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like, In } from 'typeorm';
import { Service } from '../../domain/service.entity';
import { IServiceRepository } from '../../domain/service.interface';

@Injectable()
export class ServiceRepository implements IServiceRepository {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepository: Repository<Service>,
    ) { }

    async findById(id: string): Promise<Service | null> {
        return this.serviceRepository.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['serviceGroup', 'unitOfMeasure', 'parentService', 'subServices'],
        });
    }

    async findByCode(serviceCode: string): Promise<Service | null> {
        return this.serviceRepository.findOne({
            where: { serviceCode, deletedAt: IsNull() },
            relations: ['serviceGroup', 'unitOfMeasure', 'parentService', 'subServices'],
        });
    }

    async findByName(serviceName: string): Promise<Service | null> {
        return this.serviceRepository.findOne({
            where: { serviceName, deletedAt: IsNull() },
            relations: ['serviceGroup', 'unitOfMeasure', 'parentService', 'subServices'],
        });
    }

    async save(service: Service): Promise<Service> {
        return this.serviceRepository.save(service);
    }

    async delete(id: string): Promise<void> {
        await this.serviceRepository.softDelete(id);
    }

    async findAndCount(
        limit: number,
        offset: number,
        search?: string,
        serviceGroupId?: string,
        unitOfMeasureId?: string,
        parentServiceId?: string,
        isActive?: boolean,
    ): Promise<[Service[], number]> {
        const queryBuilder = this.serviceRepository
            .createQueryBuilder('service')
            .leftJoinAndSelect('service.serviceGroup', 'serviceGroup')
            .leftJoinAndSelect('service.unitOfMeasure', 'unitOfMeasure')
            .leftJoinAndSelect('service.parentService', 'parentService')
            .leftJoinAndSelect('service.subServices', 'subServices')
            .where('service.deletedAt IS NULL')
            .orderBy('service.numOrder', 'ASC')
            .addOrderBy('service.createdAt', 'DESC')
            .limit(limit)
            .offset(offset);

        // Add search condition
        if (search) {
            queryBuilder.andWhere(
                '(service.serviceCode ILIKE :search OR service.serviceName ILIKE :search OR service.shortName ILIKE :search)',
                { search: `%${search}%` }
            );
        }

        // Add service group filter
        if (serviceGroupId) {
            queryBuilder.andWhere('service.serviceGroupId = :serviceGroupId', { serviceGroupId });
        }

        // Add unit of measure filter
        if (unitOfMeasureId) {
            queryBuilder.andWhere('service.unitOfMeasureId = :unitOfMeasureId', { unitOfMeasureId });
        }

        // Add parent service filter
        if (parentServiceId) {
            queryBuilder.andWhere('service.parentServiceId = :parentServiceId', { parentServiceId });
        }

        // Add active status filter
        if (isActive !== undefined) {
            queryBuilder.andWhere('service.isActiveFlag = :isActive', { isActive: isActive ? 1 : 0 });
        }

        return queryBuilder.getManyAndCount();
    }

    async findActiveServices(limit: number, offset: number): Promise<[Service[], number]> {
        return this.serviceRepository.findAndCount({
            where: { isActiveFlag: 1, deletedAt: IsNull() },
            relations: ['serviceGroup', 'unitOfMeasure', 'parentService', 'subServices'],
            order: { numOrder: 'ASC', createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });
    }

    async findByServiceGroup(serviceGroupId: string, limit: number, offset: number): Promise<[Service[], number]> {
        return this.serviceRepository.findAndCount({
            where: { serviceGroupId, deletedAt: IsNull() },
            relations: ['serviceGroup', 'unitOfMeasure', 'parentService', 'subServices'],
            order: { numOrder: 'ASC', createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });
    }

    async findByParentService(parentServiceId: string, limit: number, offset: number): Promise<[Service[], number]> {
        return this.serviceRepository.findAndCount({
            where: { parentServiceId, deletedAt: IsNull() },
            relations: ['serviceGroup', 'unitOfMeasure', 'parentService', 'subServices'],
            order: { numOrder: 'ASC', createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });
    }

    async findHierarchy(): Promise<Service[]> {
        return this.serviceRepository.find({
            where: { deletedAt: IsNull() },
            relations: ['serviceGroup', 'unitOfMeasure', 'parentService', 'subServices'],
            order: { numOrder: 'ASC', createdAt: 'DESC' },
        });
    }
}
