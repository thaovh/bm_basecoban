import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SaveServiceRequestFromLisCommand } from '../save-service-request-from-lis.command';
import { ServiceRequestSaveService } from '../../services/service-request-save.service';
import { ServiceRequestSaveResult } from '../../../domain/service-request-save.interface';

@CommandHandler(SaveServiceRequestFromLisCommand)
export class SaveServiceRequestFromLisHandler implements ICommandHandler<SaveServiceRequestFromLisCommand> {
    private readonly logger = new Logger(SaveServiceRequestFromLisHandler.name);

    constructor(
        private readonly serviceRequestSaveService: ServiceRequestSaveService,
    ) {}

    async execute(command: SaveServiceRequestFromLisCommand): Promise<ServiceRequestSaveResult> {
        this.logger.log(`Executing SaveServiceRequestFromLisCommand`);
        
        try {
            const result = await this.serviceRequestSaveService.saveServiceRequestFromLis(command.createDto);
            
            this.logger.log(`Successfully saved ServiceRequest from LIS: ${result.serviceRequest.id}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to save ServiceRequest from LIS: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
