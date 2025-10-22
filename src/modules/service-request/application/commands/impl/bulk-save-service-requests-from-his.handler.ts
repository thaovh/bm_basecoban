import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { BulkSaveServiceRequestsFromHisCommand } from '../bulk-save-service-requests-from-his.command';
import { ServiceRequestSaveService } from '../../services/service-request-save.service';
import { BulkSaveServiceRequestResult } from '../../../domain/service-request-save.interface';

@CommandHandler(BulkSaveServiceRequestsFromHisCommand)
export class BulkSaveServiceRequestsFromHisHandler implements ICommandHandler<BulkSaveServiceRequestsFromHisCommand> {
    private readonly logger = new Logger(BulkSaveServiceRequestsFromHisHandler.name);

    constructor(
        private readonly serviceRequestSaveService: ServiceRequestSaveService,
    ) {}

    async execute(command: BulkSaveServiceRequestsFromHisCommand): Promise<BulkSaveServiceRequestResult> {
        this.logger.log(`Executing BulkSaveServiceRequestsFromHisCommand for ${command.hisDataList.length} service requests`);
        
        try {
            const result = await this.serviceRequestSaveService.bulkSaveServiceRequestsFromHis(command.hisDataList);
            
            this.logger.log(`Bulk save completed: ${result.successful} successful, ${result.failed} failed out of ${result.totalProcessed} total`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to bulk save ServiceRequests from HIS: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
