import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, ConflictException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateResultTrackingCommand } from '../create-result-tracking.command';
import { ResultTracking } from '../../../domain/result-tracking.entity';
import { IResultTrackingRepository } from '../../../domain/result-tracking.interface';

@CommandHandler(CreateResultTrackingCommand)
export class CreateResultTrackingHandler implements ICommandHandler<CreateResultTrackingCommand> {
    private readonly logger = new Logger(CreateResultTrackingHandler.name);

    constructor(
        @Inject('IResultTrackingRepository')
        private readonly resultTrackingRepository: IResultTrackingRepository,
    ) { }

    async execute(command: CreateResultTrackingCommand): Promise<ResultTracking> {
        this.logger.log(`Executing CreateResultTrackingCommand for service request: ${command.createResultTrackingDto.serviceRequestId}`);

        try {
            // Check if there's already an active tracking for this service request
            const existingTracking = await this.resultTrackingRepository.findCurrentTrackingByServiceRequest(
                command.createResultTrackingDto.serviceRequestId
            );

            if (existingTracking) {
                throw new ConflictException(`Service request ${command.createResultTrackingDto.serviceRequestId} already has an active tracking`);
            }

            // Create new ResultTracking
            const resultTracking = new ResultTracking();
            resultTracking.id = uuidv4();
            resultTracking.serviceRequestId = command.createResultTrackingDto.serviceRequestId;
            resultTracking.resultStatusId = command.createResultTrackingDto.resultStatusId;
            resultTracking.roomId = command.createResultTrackingDto.roomId;
            resultTracking.inRoomId = command.createResultTrackingDto.inRoomId;
            resultTracking.sampleTypeId = command.createResultTrackingDto.sampleTypeId;
            resultTracking.sampleCode = command.createResultTrackingDto.sampleCode;
            resultTracking.note = command.createResultTrackingDto.note;

            // Set in tracking time if provided, otherwise set to current time
            if (command.createResultTrackingDto.inTrackingTime) {
                resultTracking.inTrackingTime = new Date(command.createResultTrackingDto.inTrackingTime);
            } else {
                resultTracking.inTrackingTime = new Date();
            }

            // Set out tracking time if provided
            if (command.createResultTrackingDto.outTrackingTime) {
                resultTracking.outTrackingTime = new Date(command.createResultTrackingDto.outTrackingTime);
            }

            const savedResultTracking = await this.resultTrackingRepository.save(resultTracking);

            this.logger.log(`Successfully created ResultTracking: ${savedResultTracking.id}`);
            return savedResultTracking;
        } catch (error) {
            this.logger.error(`Failed to create ResultTracking: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
