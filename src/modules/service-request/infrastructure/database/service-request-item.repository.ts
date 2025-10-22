import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ServiceRequestItem } from '../../domain/service-request-item.entity';
import { IServiceRequestItemRepository } from '../../domain/service-request.interface';

@Injectable()
export class ServiceRequestItemRepository implements IServiceRequestItemRepository {
    private readonly logger = new Logger(ServiceRequestItemRepository.name);

    constructor(
        @InjectRepository(ServiceRequestItem)
        private readonly serviceRequestItemRepository: Repository<ServiceRequestItem>,
    ) { }

    async findById(id: string): Promise<ServiceRequestItem | null> {
        try {
            return await this.serviceRequestItemRepository.findOne({
                where: { id, deletedAt: IsNull() },
                relations: ['serviceRequest', 'lisService', 'serviceGroup', 'unitOfMeasure', 'serviceRequestItemTests'],
            });
        } catch (error) {
            this.logger.error(`Error finding service request item by ID: ${id}`, error);
            throw error;
        }
    }

    async findByServiceRequestId(serviceRequestId: string): Promise<ServiceRequestItem[]> {
        try {
            return await this.serviceRequestItemRepository.find({
                where: { serviceRequestId, deletedAt: IsNull() },
                relations: ['serviceRequest', 'lisService', 'serviceGroup', 'unitOfMeasure', 'serviceRequestItemTests'],
                order: { itemOrder: 'ASC' },
            });
        } catch (error) {
            this.logger.error(`Error finding service request items by service request ID: ${serviceRequestId}`, error);
            throw error;
        }
    }

    async findByHisSereServId(hisSereServId: number): Promise<ServiceRequestItem | null> {
        try {
            return await this.serviceRequestItemRepository.findOne({
                where: { hisSereServId, deletedAt: IsNull() },
                relations: ['serviceRequest', 'lisService', 'serviceGroup', 'unitOfMeasure', 'serviceRequestItemTests'],
            });
        } catch (error) {
            this.logger.error(`Error finding service request item by HIS Sere Serv ID: ${hisSereServId}`, error);
            throw error;
        }
    }

    async save(serviceRequestItem: ServiceRequestItem): Promise<ServiceRequestItem> {
        try {
            return await this.serviceRequestItemRepository.save(serviceRequestItem);
        } catch (error) {
            this.logger.error('Error saving service request item', error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.serviceRequestItemRepository.softDelete(id);
        } catch (error) {
            this.logger.error(`Error deleting service request item: ${id}`, error);
            throw error;
        }
    }

    async findActiveServiceRequestItems(limit: number, offset: number): Promise<[ServiceRequestItem[], number]> {
        try {
            return await this.serviceRequestItemRepository.findAndCount({
                where: { isActiveFlag: 1, deletedAt: IsNull() },
                relations: ['serviceRequest', 'lisService', 'serviceGroup', 'unitOfMeasure', 'serviceRequestItemTests'],
                take: limit,
                skip: offset,
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            this.logger.error('Error finding active service request items', error);
            throw error;
        }
    }

    async findAllServiceRequestItems(limit: number, offset: number): Promise<[ServiceRequestItem[], number]> {
        try {
            return await this.serviceRequestItemRepository.findAndCount({
                where: { deletedAt: IsNull() },
                relations: ['serviceRequest', 'lisService', 'serviceGroup', 'unitOfMeasure', 'serviceRequestItemTests'],
                take: limit,
                skip: offset,
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            this.logger.error('Error finding all service request items', error);
            throw error;
        }
    }

    async searchServiceRequestItems(searchTerm: string, limit: number, offset: number): Promise<[ServiceRequestItem[], number]> {
        try {
            const queryBuilder = this.serviceRequestItemRepository
                .createQueryBuilder('serviceRequestItem')
                .leftJoinAndSelect('serviceRequestItem.serviceRequest', 'serviceRequest')
                .leftJoinAndSelect('serviceRequestItem.lisService', 'lisService')
                .leftJoinAndSelect('serviceRequestItem.serviceGroup', 'serviceGroup')
                .leftJoinAndSelect('serviceRequestItem.unitOfMeasure', 'unitOfMeasure')
                .leftJoinAndSelect('serviceRequestItem.serviceRequestItemTests', 'serviceRequestItemTests')
                .where('serviceRequestItem.deletedAt IS NULL')
                .andWhere(
                    '(serviceRequestItem.hisServiceCode ILIKE :searchTerm OR ' +
                    'serviceRequestItem.hisServiceName ILIKE :searchTerm OR ' +
                    'serviceRequestItem.lisServiceCode ILIKE :searchTerm OR ' +
                    'serviceRequestItem.lisServiceName ILIKE :searchTerm)',
                    { searchTerm: `%${searchTerm}%` }
                )
                .orderBy('serviceRequestItem.createdAt', 'DESC')
                .limit(limit)
                .offset(offset);

            return await queryBuilder.getManyAndCount();
        } catch (error) {
            this.logger.error(`Error searching service request items: ${searchTerm}`, error);
            throw error;
        }
    }
}