import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { UpdateServicePriceCommand } from '../update-service-price.command';
import { IServiceRepository, IServicePriceHistoryRepository } from '../../../domain/service.interface';
import { AppError, HTTP_CLIENT_ERROR } from '../../../../../common/dtos/base-response.dto';
import { ServicePriceHistory } from '../../../domain/service-price-history.entity';

@CommandHandler(UpdateServicePriceCommand)
export class UpdateServicePriceHandler implements ICommandHandler<UpdateServicePriceCommand> {
    private readonly logger = new Logger(UpdateServicePriceHandler.name);

    constructor(
        @Inject('IServiceRepository')
        private readonly serviceRepository: IServiceRepository,
        @Inject('IServicePriceHistoryRepository')
        private readonly priceHistoryRepository: IServicePriceHistoryRepository,
    ) { }

    async execute(command: UpdateServicePriceCommand): Promise<ServicePriceHistory> {
        this.logger.log(`Executing UpdateServicePriceCommand for service id: ${command.serviceId}`);

        const { serviceId, updatePriceDto } = command;

        // Check if service exists
        const service = await this.serviceRepository.findById(serviceId);
        if (!service) {
            throw new AppError('Service not found', 'SERVICE_NOT_FOUND', HTTP_CLIENT_ERROR.NOT_FOUND);
        }

        // Close current price history
        const effectiveTo = new Date(updatePriceDto.effectiveFrom);
        effectiveTo.setSeconds(effectiveTo.getSeconds() - 1); // 1 second before new price
        await this.priceHistoryRepository.closeCurrentPriceHistory(serviceId, effectiveTo);

        // Create new price history
        const newPriceHistory = new ServicePriceHistory();
        newPriceHistory.serviceId = serviceId;
        newPriceHistory.price = updatePriceDto.price;
        newPriceHistory.effectiveFrom = new Date(updatePriceDto.effectiveFrom);
        newPriceHistory.effectiveTo = undefined; // Current price
        newPriceHistory.reason = updatePriceDto.reason;

        const savedPriceHistory = await this.priceHistoryRepository.save(newPriceHistory);

        // Update service current price
        service.currentPrice = updatePriceDto.price;
        await this.serviceRepository.save(service);

        return savedPriceHistory;
    }
}
