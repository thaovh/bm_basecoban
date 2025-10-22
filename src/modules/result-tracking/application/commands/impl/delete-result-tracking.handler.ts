import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DeleteResultTrackingCommand } from '../delete-result-tracking.command';
import { IResultTrackingRepository } from '../../../domain/result-tracking.interface';

@CommandHandler(DeleteResultTrackingCommand)
export class DeleteResultTrackingHandler implements ICommandHandler<DeleteResultTrackingCommand> {
    private readonly logger = new Logger(DeleteResultTrackingHandler.name);

    constructor(
        @Inject('IResultTrackingRepository')
        private readonly resultTrackingRepository: IResultTrackingRepository,
    ) { }

    async execute(command: DeleteResultTrackingCommand): Promise<void> {
        this.logger.log(`Executing DeleteResultTrackingCommand for ID: ${command.id}`);

        try {
            // Check if ResultTracking exists
            const existingResultTracking = await this.resultTrackingRepository.findById(command.id);
            if (!existingResultTracking) {
                throw new NotFoundException(`ResultTracking with ID '${command.id}' not found`);
            }

            // Soft delete the ResultTracking
            await this.resultTrackingRepository.softDelete(command.id);

            this.logger.log(`Successfully deleted ResultTracking: ${command.id}`);
        } catch (error) {
            this.logger.error(`Failed to delete ResultTracking: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
