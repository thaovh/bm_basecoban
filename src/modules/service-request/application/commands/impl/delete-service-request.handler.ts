import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteServiceRequestCommand } from '../delete-service-request.command';
import { IServiceRequestRepository } from '../../../domain/service-request.interface';

@CommandHandler(DeleteServiceRequestCommand)
export class DeleteServiceRequestHandler implements ICommandHandler<DeleteServiceRequestCommand> {
    private readonly logger = new Logger(DeleteServiceRequestHandler.name);

    constructor(
        @Inject('IServiceRequestRepository')
        private readonly serviceRequestRepository: IServiceRequestRepository,
    ) { }

    async execute(command: DeleteServiceRequestCommand): Promise<void> {
        this.logger.log(`Deleting service request with ID: ${command.id}`);

        try {
            // Check if service request exists
            const existingServiceRequest = await this.serviceRequestRepository.findById(command.id);

            if (!existingServiceRequest) {
                throw new Error(`Service request with ID ${command.id} not found`);
            }

            // Soft delete the service request
            await this.serviceRequestRepository.delete(command.id);

            this.logger.log(`Service request deleted successfully with ID: ${command.id}`);

        } catch (error) {
            this.logger.error(`Error deleting service request: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }
}
