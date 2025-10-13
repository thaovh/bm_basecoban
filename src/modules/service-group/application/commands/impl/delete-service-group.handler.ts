import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { DeleteServiceGroupCommand } from '../delete-service-group.command';
import { IServiceGroupRepository } from '../../../domain/service-group.interface';
import { AppError } from '../../../../../common/dtos/base-response.dto';

@CommandHandler(DeleteServiceGroupCommand)
export class DeleteServiceGroupHandler implements ICommandHandler<DeleteServiceGroupCommand> {
    private readonly logger = new Logger(DeleteServiceGroupHandler.name);

    constructor(
        @Inject('IServiceGroupRepository')
        private readonly serviceGroupRepository: IServiceGroupRepository,
    ) { }

    async execute(command: DeleteServiceGroupCommand): Promise<void> {
        const { id } = command;
        this.logger.log(`Deleting service group: ${id}`);

        // Check if service group exists
        const existingServiceGroup = await this.serviceGroupRepository.findById(id);
        if (!existingServiceGroup) {
            throw new AppError('BIZ_001', 'Service group not found', 404);
        }

        // Soft delete
        await this.serviceGroupRepository.delete(id);

        this.logger.log(`Service group deleted successfully: ${id}`);
    }
}
