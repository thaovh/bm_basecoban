import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { DeleteWardCommand } from '../delete-ward.command';
import { IWardRepository } from '../../../domain/ward.interface';

@CommandHandler(DeleteWardCommand)
export class DeleteWardHandler implements ICommandHandler<DeleteWardCommand> {
    private readonly logger = new Logger(DeleteWardHandler.name);

    constructor(
        @Inject('IWardRepository')
        private readonly wardRepository: IWardRepository,
    ) {}

    async execute(command: DeleteWardCommand): Promise<void> {
        const { id } = command;
        this.logger.log(`Deleting ward: ${id}`);

        // Check if ward exists
        const existingWard = await this.wardRepository.findById(id);
        if (!existingWard) {
            throw new NotFoundException('Ward not found');
        }

        // Soft delete the ward
        await this.wardRepository.delete(id);
        this.logger.log(`Ward deleted successfully: ${id}`);
    }
}
