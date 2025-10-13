import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { Service } from '../../../domain/service.entity';
import { CreateServiceCommand } from '../create-service.command';
import { IServiceRepository, IServicePriceHistoryRepository } from '../../../domain/service.interface';
import { AppError, HTTP_CLIENT_ERROR } from '../../../../../common/dtos/base-response.dto';
import { ServicePriceHistory } from '../../../domain/service-price-history.entity';

@CommandHandler(CreateServiceCommand)
export class CreateServiceHandler implements ICommandHandler<CreateServiceCommand> {
    private readonly logger = new Logger(CreateServiceHandler.name);

    constructor(
        @Inject('IServiceRepository')
        private readonly serviceRepository: IServiceRepository,
        @Inject('IServicePriceHistoryRepository')
        private readonly priceHistoryRepository: IServicePriceHistoryRepository,
    ) { }

    async execute(command: CreateServiceCommand): Promise<Service> {
        this.logger.log(`Executing CreateServiceCommand for code: ${command.createServiceDto.serviceCode}`);

        const {
            serviceCode,
            serviceName,
            shortName,
            serviceGroupId,
            unitOfMeasureId,
            mapping,
            numOrder,
            currentPrice,
            parentServiceId,
            isActiveFlag
        } = command.createServiceDto;

        // Check if service code already exists
        const existingService = await this.serviceRepository.findByCode(serviceCode);
        if (existingService) {
            throw new AppError('Service code already exists', 'SERVICE_CODE_CONFLICT', HTTP_CLIENT_ERROR.CONFLICT);
        }

        // Create new service
        const newService = new Service();
        newService.serviceCode = serviceCode;
        newService.serviceName = serviceName;
        newService.shortName = shortName;
        newService.serviceGroupId = serviceGroupId;
        newService.unitOfMeasureId = unitOfMeasureId;
        newService.mapping = mapping;
        newService.numOrder = numOrder || 0;
        newService.currentPrice = currentPrice;
        newService.parentServiceId = parentServiceId;
        newService.isActiveFlag = isActiveFlag ?? 1;

        const savedService = await this.serviceRepository.save(newService);

        // Create initial price history if price is provided
        if (currentPrice && currentPrice > 0) {
            const priceHistory = new ServicePriceHistory();
            priceHistory.serviceId = savedService.id;
            priceHistory.price = currentPrice;
            priceHistory.effectiveFrom = new Date();
            priceHistory.effectiveTo = undefined; // Current price
            priceHistory.reason = 'Initial price';

            await this.priceHistoryRepository.save(priceHistory);
        }

        return savedService;
    }
}
