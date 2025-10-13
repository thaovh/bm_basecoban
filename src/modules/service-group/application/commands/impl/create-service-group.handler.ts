import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ServiceGroup } from '../../../domain/service-group.entity';
import { CreateServiceGroupCommand } from '../create-service-group.command';
import { IServiceGroupRepository } from '../../../domain/service-group.interface';
import { AppError } from '../../../../../common/dtos/base-response.dto';

@CommandHandler(CreateServiceGroupCommand)
export class CreateServiceGroupHandler implements ICommandHandler<CreateServiceGroupCommand> {
    private readonly logger = new Logger(CreateServiceGroupHandler.name);

    constructor(
        @Inject('IServiceGroupRepository')
        private readonly serviceGroupRepository: IServiceGroupRepository,
    ) { }

    async execute(command: CreateServiceGroupCommand): Promise<ServiceGroup> {
        const { createServiceGroupDto } = command;
        this.logger.log(`Creating service group: ${createServiceGroupDto.serviceGroupName}`);

        // Check if service group code already exists
        const existingByCode = await this.serviceGroupRepository.findByCode(createServiceGroupDto.serviceGroupCode);
        if (existingByCode) {
            throw new AppError('BIZ_002', 'Service group code already exists', 409);
        }

        // Check if service group name already exists
        const existingByName = await this.serviceGroupRepository.findByName(createServiceGroupDto.serviceGroupName);
        if (existingByName) {
            throw new AppError('BIZ_002', 'Service group name already exists', 409);
        }

        // Create new service group
        const serviceGroup = new ServiceGroup();
        serviceGroup.serviceGroupCode = createServiceGroupDto.serviceGroupCode;
        serviceGroup.serviceGroupName = createServiceGroupDto.serviceGroupName;
        serviceGroup.shortName = createServiceGroupDto.shortName;
        serviceGroup.mapping = createServiceGroupDto.mapping;

        const savedServiceGroup = await this.serviceGroupRepository.save(serviceGroup);

        this.logger.log(`Service group created successfully: ${savedServiceGroup.id}`);
        return savedServiceGroup;
    }
}
