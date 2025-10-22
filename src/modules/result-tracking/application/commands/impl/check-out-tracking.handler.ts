import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CheckOutTrackingCommand } from '../check-out-tracking.command';
import { ResultTracking } from '../../../domain/result-tracking.entity';
import { IResultTrackingRepository } from '../../../domain/result-tracking.interface';

@CommandHandler(CheckOutTrackingCommand)
export class CheckOutTrackingHandler implements ICommandHandler<CheckOutTrackingCommand> {
    private readonly logger = new Logger(CheckOutTrackingHandler.name);

    constructor(
        @Inject('IResultTrackingRepository')
        private readonly resultTrackingRepository: IResultTrackingRepository,
    ) { }

    async execute(command: CheckOutTrackingCommand): Promise<ResultTracking> {
        this.logger.log(`Executing CheckOutTrackingCommand for ID: ${command.id}`);

        try {
            // Check if ResultTracking exists
            const existingResultTracking = await this.resultTrackingRepository.findById(command.id);
            if (!existingResultTracking) {
                throw new NotFoundException(`ResultTracking with ID '${command.id}' not found`);
            }

            // Check if already checked out
            if (existingResultTracking.outTrackingTime) {
                throw new BadRequestException(`ResultTracking ${command.id} is already checked out`);
            }

            // Update with check-out time and note
            const updateData: Partial<ResultTracking> = {
                outTrackingTime: new Date(), // Set current time for check-out
            };

            if (command.checkOutTrackingDto.note) {
                updateData.note = command.checkOutTrackingDto.note;
            }

            const updatedResultTracking = await this.resultTrackingRepository.update(command.id, updateData);

            this.logger.log(`Successfully checked out ResultTracking: ${updatedResultTracking.id}`);
            return updatedResultTracking;
        } catch (error) {
            this.logger.error(`Failed to check out ResultTracking: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
