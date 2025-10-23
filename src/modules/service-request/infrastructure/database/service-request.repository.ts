import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ServiceRequest } from '../../domain/service-request.entity';
import { IServiceRequestRepository } from '../../domain/service-request.interface';

@Injectable()
export class ServiceRequestRepository implements IServiceRequestRepository {
    private readonly logger = new Logger(ServiceRequestRepository.name);

    constructor(
        @InjectRepository(ServiceRequest)
        private readonly serviceRequestRepository: Repository<ServiceRequest>,
    ) { }

    async findById(id: string): Promise<ServiceRequest | null> {
        try {
            return await this.serviceRequestRepository.findOne({
                where: { id, deletedAt: IsNull() },
                relations: ['serviceRequestItems', 'serviceRequestItems.serviceRequestItemTests', 'serviceRequestItems.lisService'],
            });
        } catch (error) {
            this.logger.error(`Error finding service request by ID: ${id}`, error);
            throw error;
        }
    }

    async findByCode(serviceReqCode: string): Promise<ServiceRequest | null> {
        try {
            return await this.serviceRequestRepository.findOne({
                where: { serviceReqCode, deletedAt: IsNull() },
                relations: ['serviceRequestItems', 'serviceRequestItems.serviceRequestItemTests', 'serviceRequestItems.lisService'],
            });
        } catch (error) {
            this.logger.error(`Error finding service request by code: ${serviceReqCode}`, error);
            throw error;
        }
    }

    async findByHisId(hisServiceReqId: number): Promise<ServiceRequest | null> {
        try {
            return await this.serviceRequestRepository.findOne({
                where: { hisServiceReqId, deletedAt: IsNull() },
                relations: ['serviceRequestItems', 'serviceRequestItems.serviceRequestItemTests', 'serviceRequestItems.lisService'],
            });
        } catch (error) {
            this.logger.error(`Error finding service request by HIS ID: ${hisServiceReqId}`, error);
            throw error;
        }
    }

    async save(serviceRequest: ServiceRequest): Promise<ServiceRequest> {
        try {
            return await this.serviceRequestRepository.save(serviceRequest);
        } catch (error) {
            this.logger.error('Error saving service request', error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.serviceRequestRepository.softDelete(id);
        } catch (error) {
            this.logger.error(`Error deleting service request: ${id}`, error);
            throw error;
        }
    }

    async findActiveServiceRequests(limit: number, offset: number): Promise<[ServiceRequest[], number]> {
        try {
            return await this.serviceRequestRepository.findAndCount({
                where: { isActiveFlag: 1, deletedAt: IsNull() },
                relations: ['serviceRequestItems', 'serviceRequestItems.serviceRequestItemTests', 'serviceRequestItems.lisService'],
                take: limit,
                skip: offset,
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            this.logger.error('Error finding active service requests', error);
            throw error;
        }
    }

    async findAllServiceRequests(limit: number, offset: number): Promise<[ServiceRequest[], number]> {
        try {
            return await this.serviceRequestRepository.findAndCount({
                where: { deletedAt: IsNull() },
                relations: ['serviceRequestItems', 'serviceRequestItems.serviceRequestItemTests', 'serviceRequestItems.lisService'],
                take: limit,
                skip: offset,
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            this.logger.error('Error finding all service requests', error);
            throw error;
        }
    }

    async searchServiceRequests(searchTerm: string, limit: number, offset: number): Promise<[ServiceRequest[], number]> {
        try {
            const queryBuilder = this.serviceRequestRepository
                .createQueryBuilder('serviceRequest')
                .leftJoinAndSelect('serviceRequest.serviceRequestItems', 'serviceRequestItems')
                .leftJoinAndSelect('serviceRequestItems.serviceRequestItemTests', 'serviceRequestItemTests')
                .where('serviceRequest.deletedAt IS NULL')
                .andWhere(
                    '(serviceRequest.serviceReqCode ILIKE :searchTerm OR ' +
                    'serviceRequest.patientName ILIKE :searchTerm OR ' +
                    'serviceRequest.patientCode ILIKE :searchTerm OR ' +
                    'serviceRequest.icdName ILIKE :searchTerm)',
                    { searchTerm: `%${searchTerm}%` }
                )
                .orderBy('serviceRequest.createdAt', 'DESC')
                .limit(limit)
                .offset(offset);

            return await queryBuilder.getManyAndCount();
        } catch (error) {
            this.logger.error(`Error searching service requests: ${searchTerm}`, error);
            throw error;
        }
    }

    async findByPatientId(patientId: number, limit: number, offset: number): Promise<[ServiceRequest[], number]> {
        try {
            return await this.serviceRequestRepository.findAndCount({
                where: { patientId, deletedAt: IsNull() },
                relations: ['serviceRequestItems', 'serviceRequestItems.serviceRequestItemTests', 'serviceRequestItems.lisService'],
                take: limit,
                skip: offset,
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            this.logger.error(`Error finding service requests by patient ID: ${patientId}`, error);
            throw error;
        }
    }

    async findByTreatmentId(treatmentId: number, limit: number, offset: number): Promise<[ServiceRequest[], number]> {
        try {
            return await this.serviceRequestRepository.findAndCount({
                where: { treatmentId, deletedAt: IsNull() },
                relations: ['serviceRequestItems', 'serviceRequestItems.serviceRequestItemTests', 'serviceRequestItems.lisService'],
                take: limit,
                skip: offset,
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            this.logger.error(`Error finding service requests by treatment ID: ${treatmentId}`, error);
            throw error;
        }
    }
}