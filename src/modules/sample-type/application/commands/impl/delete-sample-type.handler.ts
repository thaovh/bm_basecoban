import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { DeleteSampleTypeCommand } from '../delete-sample-type.command';
import { ISampleTypeRepository } from '../../../domain/sample-type.interface';

@CommandHandler(DeleteSampleTypeCommand)
export class DeleteSampleTypeHandler implements ICommandHandler<DeleteSampleTypeCommand> {
    private readonly logger = new Logger(DeleteSampleTypeHandler.name);

    constructor(
        @Inject('ISampleTypeRepository')
        private readonly sampleTypeRepository: ISampleTypeRepository,
    ) { }

    async execute(command: DeleteSampleTypeCommand): Promise<void> {
        const { id } = command;
        this.logger.log(`Deleting sample type: ${id}`);

        // Check if sample type exists
        const existingSampleType = await this.sampleTypeRepository.findById(id);
        if (!existingSampleType) {
            throw new NotFoundException('Sample type not found');
        }

        // Soft delete the sample type
        await this.sampleTypeRepository.delete(id);
        this.logger.log(`Sample type deleted successfully: ${id}`);
    }
}
