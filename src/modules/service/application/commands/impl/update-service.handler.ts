import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { Service } from '../../../domain/service.entity';
import { UpdateServiceCommand } from '../update-service.command';
import { IServiceRepository } from '../../../domain/service.interface';
import { AppError, HTTP_CLIENT_ERROR } from '../../../../../common/dtos/base-response.dto';

@CommandHandler(UpdateServiceCommand)
export class UpdateServiceHandler implements ICommandHandler<UpdateServiceCommand> {
    private readonly logger = new Logger(UpdateServiceHandler.name);

    constructor(
        @Inject('IServiceRepository')
        private readonly serviceRepository: IServiceRepository,
    ) { }

    async execute(command: UpdateServiceCommand): Promise<Service> {
        this.logger.log(`Executing UpdateServiceCommand for id: ${command.id}`);

        const { id, updateServiceDto } = command;
        const service = await this.serviceRepository.findById(id);

        if (!service) {
            throw new AppError('Service not found', 'SERVICE_NOT_FOUND', HTTP_CLIENT_ERROR.NOT_FOUND);
        }

        // Update fields if provided
        if (updateServiceDto.serviceName) {
            service.serviceName = updateServiceDto.serviceName;
        }
        if (updateServiceDto.shortName) {
            service.shortName = updateServiceDto.shortName;
        }
        if (updateServiceDto.serviceGroupId) {
            service.serviceGroupId = updateServiceDto.serviceGroupId;
        }
        if (updateServiceDto.unitOfMeasureId) {
            service.unitOfMeasureId = updateServiceDto.unitOfMeasureId;
        }
        if (updateServiceDto.mapping !== undefined) {
            service.mapping = updateServiceDto.mapping;
        }
        if (updateServiceDto.numOrder !== undefined) {
            service.numOrder = updateServiceDto.numOrder;
        }
        if (updateServiceDto.currentPrice !== undefined) {
            service.currentPrice = updateServiceDto.currentPrice;
        }
        if (updateServiceDto.parentServiceId !== undefined) {
            service.parentServiceId = updateServiceDto.parentServiceId;
        }
        if (updateServiceDto.isActiveFlag !== undefined) {
            service.isActiveFlag = updateServiceDto.isActiveFlag;
        }

        return this.serviceRepository.save(service);
    }
}
