import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SaveToLisCommand } from '../save-to-lis.command';
import { SaveToLisResult } from '../../../domain/save-to-lis.dto';

@CommandHandler(SaveToLisCommand)
export class SaveToLisHandler implements ICommandHandler<SaveToLisCommand> {
    private readonly logger = new Logger(SaveToLisHandler.name);

    async execute(command: SaveToLisCommand): Promise<SaveToLisResult> {
        this.logger.log(`Executing SaveToLisCommand for service request: ${command.saveToLisDto.serviceReqCode}`);

        const { serviceReqCode, roomId, statusId, note } = command.saveToLisDto;

        // For now, return a simple response indicating the endpoint is ready
        // TODO: Implement the full workflow with:
        // 1. Get data from HIS
        // 2. Save to LIS database
        // 3. Start tracking

        const result: SaveToLisResult = {
            serviceRequestId: 'temp-service-request-id',
            resultTrackingId: 'temp-tracking-id',
            serviceReqCode: serviceReqCode,
            patient: null,
            services: [],
            totalAmount: 0,
            tracking: {
                id: 'temp-tracking-id',
                inTrackingTime: new Date(),
                resultStatusId: statusId,
                roomId: roomId,
                note: note || `Bắt đầu xử lý mẫu xét nghiệm ${serviceReqCode}`
            },
            message: `Save to LIS endpoint is ready. Service request ${serviceReqCode} will be processed with room ${roomId} and status ${statusId}`
        };

        this.logger.log(`Successfully completed SaveToLisCommand for service request: ${serviceReqCode}`);
        return result;
    }
}