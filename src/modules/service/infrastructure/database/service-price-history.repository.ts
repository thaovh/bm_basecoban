import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Between } from 'typeorm';
import { ServicePriceHistory } from '../../domain/service-price-history.entity';
import { IServicePriceHistoryRepository } from '../../domain/service.interface';

@Injectable()
export class ServicePriceHistoryRepository implements IServicePriceHistoryRepository {
    constructor(
        @InjectRepository(ServicePriceHistory)
        private readonly priceHistoryRepository: Repository<ServicePriceHistory>,
    ) { }

    async findByServiceId(serviceId: string): Promise<ServicePriceHistory[]> {
        return this.priceHistoryRepository.find({
            where: { serviceId, deletedAt: IsNull() },
            order: { effectiveFrom: 'DESC' },
        });
    }

    async findByServiceIdAndDate(serviceId: string, date: Date): Promise<ServicePriceHistory | null> {
        return this.priceHistoryRepository.findOne({
            where: {
                serviceId,
                deletedAt: IsNull(),
                effectiveFrom: Between(new Date('1900-01-01'), date),
            },
            order: { effectiveFrom: 'DESC' },
        });
    }

    async findCurrentPrice(serviceId: string): Promise<ServicePriceHistory | null> {
        return this.priceHistoryRepository.findOne({
            where: {
                serviceId,
                deletedAt: IsNull(),
                effectiveTo: IsNull(),
            },
            order: { effectiveFrom: 'DESC' },
        });
    }

    async save(priceHistory: ServicePriceHistory): Promise<ServicePriceHistory> {
        return this.priceHistoryRepository.save(priceHistory);
    }

    async closeCurrentPriceHistory(serviceId: string, effectiveTo: Date): Promise<void> {
        await this.priceHistoryRepository.update(
            {
                serviceId,
                effectiveTo: IsNull(),
                deletedAt: IsNull(),
            },
            {
                effectiveTo,
                updatedAt: new Date(),
            }
        );
    }
}
