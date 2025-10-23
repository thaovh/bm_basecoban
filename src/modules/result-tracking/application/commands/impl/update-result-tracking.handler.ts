import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { UpdateResultTrackingCommand } from '../update-result-tracking.command';
import { ResultTracking } from '../../../domain/result-tracking.entity';
import { IResultTrackingRepository } from '../../../domain/result-tracking.interface';

@CommandHandler(UpdateResultTrackingCommand)
export class UpdateResultTrackingHandler implements ICommandHandler<UpdateResultTrackingCommand> {
    private readonly logger = new Logger(UpdateResultTrackingHandler.name);

    constructor(
        @Inject('IResultTrackingRepository')
        private readonly resultTrackingRepository: IResultTrackingRepository,
    ) { }

    async execute(command: UpdateResultTrackingCommand): Promise<ResultTracking> {
        this.logger.log(`Executing UpdateResultTrackingCommand for ID: ${command.id}`);

        try {
            // Check if ResultTracking exists
            const existingResultTracking = await this.resultTrackingRepository.findById(command.id);
            if (!existingResultTracking) {
                throw new NotFoundException(`ResultTracking with ID '${command.id}' not found`);
            }

            // Prepare update data
            const updateData: Partial<ResultTracking> = {};
            if (command.updateResultTrackingDto.serviceRequestId !== undefined) {
                updateData.serviceRequestId = command.updateResultTrackingDto.serviceRequestId;
            }
            if (command.updateResultTrackingDto.resultStatusId !== undefined) {
                updateData.resultStatusId = command.updateResultTrackingDto.resultStatusId;
            }
            if (command.updateResultTrackingDto.roomId !== undefined) {
                updateData.roomId = command.updateResultTrackingDto.roomId;
            }
            if (command.updateResultTrackingDto.inRoomId !== undefined) {
                updateData.inRoomId = command.updateResultTrackingDto.inRoomId;
            }
            if (command.updateResultTrackingDto.sampleTypeId !== undefined) {
                updateData.sampleTypeId = command.updateResultTrackingDto.sampleTypeId;
            }
            if (command.updateResultTrackingDto.sampleCode !== undefined) {
                updateData.sampleCode = command.updateResultTrackingDto.sampleCode;
            }
            if (command.updateResultTrackingDto.note !== undefined) {
                updateData.note = command.updateResultTrackingDto.note;
            }
            if (command.updateResultTrackingDto.inTrackingTime !== undefined) {
                updateData.inTrackingTime = new Date(command.updateResultTrackingDto.inTrackingTime);
            }
            if (command.updateResultTrackingDto.outTrackingTime !== undefined) {
                updateData.outTrackingTime = new Date(command.updateResultTrackingDto.outTrackingTime);
            }

            const updatedResultTracking = await this.resultTrackingRepository.update(command.id, updateData);

            this.logger.log(`Successfully updated ResultTracking: ${updatedResultTracking.id}`);
            return updatedResultTracking;
        } catch (error) {
            this.logger.error(`Failed to update ResultTracking: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
