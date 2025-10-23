import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, ConflictException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CheckInTrackingCommand } from '../check-in-tracking.command';
import { ResultTracking } from '../../../domain/result-tracking.entity';
import { IResultTrackingRepository } from '../../../domain/result-tracking.interface';

@CommandHandler(CheckInTrackingCommand)
export class CheckInTrackingHandler implements ICommandHandler<CheckInTrackingCommand> {
    private readonly logger = new Logger(CheckInTrackingHandler.name);

    constructor(
        @Inject('IResultTrackingRepository')
        private readonly resultTrackingRepository: IResultTrackingRepository,
    ) { }

    async execute(command: CheckInTrackingCommand): Promise<ResultTracking> {
        this.logger.log(`Executing CheckInTrackingCommand for service request: ${command.checkInTrackingDto.serviceRequestId}`);

        try {
            // Check if there's already an active tracking for this service request
            const existingTracking = await this.resultTrackingRepository.findCurrentTrackingByServiceRequest(
                command.checkInTrackingDto.serviceRequestId
            );

            if (existingTracking) {
                throw new ConflictException(`Service request ${command.checkInTrackingDto.serviceRequestId} already has an active tracking`);
            }

            // Create new ResultTracking for check-in
            const resultTracking = new ResultTracking();
            resultTracking.id = uuidv4();
            resultTracking.serviceRequestId = command.checkInTrackingDto.serviceRequestId;
            resultTracking.resultStatusId = command.checkInTrackingDto.resultStatusId;
            resultTracking.roomId = command.checkInTrackingDto.roomId; // This maps to REQUEST_ROOM_ID in database
            resultTracking.inRoomId = command.checkInTrackingDto.inRoomId;
            resultTracking.sampleTypeId = command.checkInTrackingDto.sampleTypeId;
            resultTracking.sampleCode = command.checkInTrackingDto.sampleCode;
            resultTracking.note = command.checkInTrackingDto.note;
            resultTracking.inTrackingTime = new Date(); // Set current time for check-in

            const savedResultTracking = await this.resultTrackingRepository.save(resultTracking);

            this.logger.log(`Successfully checked in ResultTracking: ${savedResultTracking.id}`);
            return savedResultTracking;
        } catch (error) {
            this.logger.error(`Failed to check in ResultTracking: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
