import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceTest } from '../../domain/service-test.entity';
import { IServiceTestRepository } from '../../domain/service-test.interface';

@Injectable()
export class ServiceTestRepository implements IServiceTestRepository {
    constructor(
        @InjectRepository(ServiceTest)
        private readonly serviceTestRepository: Repository<ServiceTest>,
    ) { }

    async findById(id: string): Promise<ServiceTest | null> {
        return this.serviceTestRepository
            .createQueryBuilder('serviceTest')
            .leftJoinAndSelect('serviceTest.service', 'service')
            .leftJoinAndSelect('serviceTest.unitOfMeasure', 'unitOfMeasure')
            .where('serviceTest.id = :id', { id })
            .andWhere('serviceTest.deletedAt IS NULL')
            .getOne();
    }

    async findByCode(testCode: string): Promise<ServiceTest | null> {
        return this.serviceTestRepository
            .createQueryBuilder('serviceTest')
            .leftJoinAndSelect('serviceTest.service', 'service')
            .leftJoinAndSelect('serviceTest.unitOfMeasure', 'unitOfMeasure')
            .where('serviceTest.testCode = :testCode', { testCode })
            .andWhere('serviceTest.deletedAt IS NULL')
            .getOne();
    }

    async findByName(testName: string): Promise<ServiceTest | null> {
        return this.serviceTestRepository
            .createQueryBuilder('serviceTest')
            .leftJoinAndSelect('serviceTest.service', 'service')
            .leftJoinAndSelect('serviceTest.unitOfMeasure', 'unitOfMeasure')
            .where('serviceTest.testName = :testName', { testName })
            .andWhere('serviceTest.deletedAt IS NULL')
            .getOne();
    }

    async save(serviceTest: ServiceTest): Promise<ServiceTest> {
        return this.serviceTestRepository.save(serviceTest);
    }

    async delete(id: string): Promise<void> {
        await this.serviceTestRepository.softDelete(id);
    }

    async findActiveServiceTests(limit: number, offset: number): Promise<[ServiceTest[], number]> {
        return this.serviceTestRepository.findAndCount({
            where: { deletedAt: null },
            relations: ['service', 'unitOfMeasure'],
            take: limit,
            skip: offset,
            order: { testOrder: 'ASC', createdAt: 'DESC' },
        });
    }

    async findByUnitOfMeasure(unitOfMeasureId: string): Promise<ServiceTest[]> {
        return this.serviceTestRepository.find({
            where: {
                unitOfMeasureId,
                deletedAt: null
            },
            relations: ['service', 'unitOfMeasure'],
            order: { testOrder: 'ASC', createdAt: 'DESC' },
        });
    }

    async findByService(serviceId: string): Promise<ServiceTest[]> {
        return this.serviceTestRepository.find({
            where: {
                serviceId,
                deletedAt: null
            },
            relations: ['service', 'unitOfMeasure'],
            order: { testOrder: 'ASC', createdAt: 'DESC' },
        });
    }
}
