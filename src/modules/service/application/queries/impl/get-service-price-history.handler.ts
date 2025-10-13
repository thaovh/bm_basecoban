import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { GetServicePriceHistoryQuery } from '../get-service-price-history.query';
import { IServicePriceHistoryRepository, ServicePriceHistoryResponseDto } from '../../../domain/service.interface';

@QueryHandler(GetServicePriceHistoryQuery)
export class GetServicePriceHistoryHandler implements IQueryHandler<GetServicePriceHistoryQuery> {
    private readonly logger = new Logger(GetServicePriceHistoryHandler.name);

    constructor(
        @Inject('IServicePriceHistoryRepository')
        private readonly priceHistoryRepository: IServicePriceHistoryRepository,
    ) { }

    async execute(query: GetServicePriceHistoryQuery): Promise<ServicePriceHistoryResponseDto[]> {
        this.logger.log(`Executing GetServicePriceHistoryQuery for service id: ${query.serviceId}`);

        const priceHistory = await this.priceHistoryRepository.findByServiceId(query.serviceId);

        return priceHistory.map((history) => ({
            id: history.id,
            serviceId: history.serviceId,
            price: history.price,
            effectiveFrom: history.effectiveFrom,
            effectiveTo: history.effectiveTo,
            reason: history.reason,
            createdAt: history.createdAt,
            updatedAt: history.updatedAt,
            deletedAt: history.deletedAt,
            createdBy: history.createdBy,
            updatedBy: history.updatedBy,
            version: history.version,
        }));
    }
}
