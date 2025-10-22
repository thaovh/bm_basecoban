import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SaveServiceRequestFromHisCommand } from '../save-service-request-from-his.command';
import { ServiceRequestSaveService } from '../../services/service-request-save.service';
import { ServiceRequestSaveResult } from '../../../domain/service-request-save.interface';

@CommandHandler(SaveServiceRequestFromHisCommand)
export class SaveServiceRequestFromHisHandler implements ICommandHandler<SaveServiceRequestFromHisCommand> {
    private readonly logger = new Logger(SaveServiceRequestFromHisHandler.name);

    constructor(
        private readonly serviceRequestSaveService: ServiceRequestSaveService,
    ) {}

    async execute(command: SaveServiceRequestFromHisCommand): Promise<ServiceRequestSaveResult> {
        this.logger.log(`Executing SaveServiceRequestFromHisCommand for service request: ${command.hisData.serviceReqCode}`);
        
        try {
            const result = await this.serviceRequestSaveService.saveServiceRequestFromHis(command.hisData);
            
            this.logger.log(`Successfully saved ServiceRequest: ${result.serviceRequest.id}, isNew: ${result.isNew}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to save ServiceRequest from HIS: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
