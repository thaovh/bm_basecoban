import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { UpdateServiceRequestFromHisCommand } from '../update-service-request-from-his.command';
import { ServiceRequestSaveService } from '../../services/service-request-save.service';
import { ServiceRequestSaveResult } from '../../../domain/service-request-save.interface';

@CommandHandler(UpdateServiceRequestFromHisCommand)
export class UpdateServiceRequestFromHisHandler implements ICommandHandler<UpdateServiceRequestFromHisCommand> {
    private readonly logger = new Logger(UpdateServiceRequestFromHisHandler.name);

    constructor(
        private readonly serviceRequestSaveService: ServiceRequestSaveService,
    ) {}

    async execute(command: UpdateServiceRequestFromHisCommand): Promise<ServiceRequestSaveResult> {
        this.logger.log(`Executing UpdateServiceRequestFromHisCommand for service request: ${command.serviceRequestId}`);
        
        try {
            const result = await this.serviceRequestSaveService.updateServiceRequestFromHis(
                command.serviceRequestId, 
                command.hisData
            );
            
            this.logger.log(`Successfully updated ServiceRequest: ${result.serviceRequest.id}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to update ServiceRequest from HIS: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
