import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { GetServicePriceAtDateQuery } from '../get-service-price-at-date.query';
import { IServicePriceHistoryRepository } from '../../../domain/service.interface';

@QueryHandler(GetServicePriceAtDateQuery)
export class GetServicePriceAtDateHandler implements IQueryHandler<GetServicePriceAtDateQuery> {
    private readonly logger = new Logger(GetServicePriceAtDateHandler.name);

    constructor(
        @Inject('IServicePriceHistoryRepository')
        private readonly priceHistoryRepository: IServicePriceHistoryRepository,
    ) { }

    async execute(query: GetServicePriceAtDateQuery): Promise<number> {
        this.logger.log(`Executing GetServicePriceAtDateQuery for service id: ${query.serviceId} at date: ${query.date}`);

        const priceHistory = await this.priceHistoryRepository.findByServiceIdAndDate(query.serviceId, query.date);

        return priceHistory?.price || 0;
    }
}
