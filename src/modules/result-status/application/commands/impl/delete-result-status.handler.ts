import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DeleteResultStatusCommand } from '../delete-result-status.command';
import { IResultStatusRepository } from '../../../domain/result-status.interface';

@CommandHandler(DeleteResultStatusCommand)
export class DeleteResultStatusHandler implements ICommandHandler<DeleteResultStatusCommand> {
    private readonly logger = new Logger(DeleteResultStatusHandler.name);

    constructor(
        @Inject('IResultStatusRepository')
        private readonly resultStatusRepository: IResultStatusRepository,
    ) {}

    async execute(command: DeleteResultStatusCommand): Promise<void> {
        this.logger.log(`Executing DeleteResultStatusCommand for ID: ${command.id}`);
        
        try {
            // Check if ResultStatus exists
            const existingResultStatus = await this.resultStatusRepository.findById(command.id);
            if (!existingResultStatus) {
                throw new NotFoundException(`ResultStatus with ID '${command.id}' not found`);
            }

            // Soft delete the ResultStatus
            await this.resultStatusRepository.softDelete(command.id);
            
            this.logger.log(`Successfully deleted ResultStatus: ${command.id}`);
        } catch (error) {
            this.logger.error(`Failed to delete ResultStatus: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
