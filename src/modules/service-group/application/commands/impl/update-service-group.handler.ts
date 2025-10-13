import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ServiceGroup } from '../../../domain/service-group.entity';
import { UpdateServiceGroupCommand } from '../update-service-group.command';
import { IServiceGroupRepository } from '../../../domain/service-group.interface';
import { AppError } from '../../../../../common/dtos/base-response.dto';

@CommandHandler(UpdateServiceGroupCommand)
export class UpdateServiceGroupHandler implements ICommandHandler<UpdateServiceGroupCommand> {
    private readonly logger = new Logger(UpdateServiceGroupHandler.name);

    constructor(
        @Inject('IServiceGroupRepository')
        private readonly serviceGroupRepository: IServiceGroupRepository,
    ) { }

    async execute(command: UpdateServiceGroupCommand): Promise<ServiceGroup> {
        const { id, updateServiceGroupDto } = command;
        this.logger.log(`Updating service group: ${id}`);

        // Find existing service group
        const existingServiceGroup = await this.serviceGroupRepository.findById(id);
        if (!existingServiceGroup) {
            throw new AppError('BIZ_001', 'Service group not found', 404);
        }

        // Check if new service group code already exists (if being updated)
        if (updateServiceGroupDto.serviceGroupCode &&
            updateServiceGroupDto.serviceGroupCode !== existingServiceGroup.serviceGroupCode) {
            const existingByCode = await this.serviceGroupRepository.findByCode(updateServiceGroupDto.serviceGroupCode);
            if (existingByCode) {
                throw new AppError('BIZ_002', 'Service group code already exists', 409);
            }
        }

        // Check if new service group name already exists (if being updated)
        if (updateServiceGroupDto.serviceGroupName &&
            updateServiceGroupDto.serviceGroupName !== existingServiceGroup.serviceGroupName) {
            const existingByName = await this.serviceGroupRepository.findByName(updateServiceGroupDto.serviceGroupName);
            if (existingByName) {
                throw new AppError('BIZ_002', 'Service group name already exists', 409);
            }
        }

        // Update fields
        if (updateServiceGroupDto.serviceGroupCode !== undefined) {
            existingServiceGroup.serviceGroupCode = updateServiceGroupDto.serviceGroupCode;
        }
        if (updateServiceGroupDto.serviceGroupName !== undefined) {
            existingServiceGroup.serviceGroupName = updateServiceGroupDto.serviceGroupName;
        }
        if (updateServiceGroupDto.shortName !== undefined) {
            existingServiceGroup.shortName = updateServiceGroupDto.shortName;
        }
        if (updateServiceGroupDto.mapping !== undefined) {
            existingServiceGroup.mapping = updateServiceGroupDto.mapping;
        }

        const updatedServiceGroup = await this.serviceGroupRepository.save(existingServiceGroup);

        this.logger.log(`Service group updated successfully: ${updatedServiceGroup.id}`);
        return updatedServiceGroup;
    }
}
