import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { UpdateResultStatusCommand } from '../update-result-status.command';
import { ResultStatus } from '../../../domain/result-status.entity';
import { IResultStatusRepository } from '../../../domain/result-status.interface';

@CommandHandler(UpdateResultStatusCommand)
export class UpdateResultStatusHandler implements ICommandHandler<UpdateResultStatusCommand> {
    private readonly logger = new Logger(UpdateResultStatusHandler.name);

    constructor(
        @Inject('IResultStatusRepository')
        private readonly resultStatusRepository: IResultStatusRepository,
    ) {}

    async execute(command: UpdateResultStatusCommand): Promise<ResultStatus> {
        this.logger.log(`Executing UpdateResultStatusCommand for ID: ${command.id}`);
        
        try {
            // Check if ResultStatus exists
            const existingResultStatus = await this.resultStatusRepository.findById(command.id);
            if (!existingResultStatus) {
                throw new NotFoundException(`ResultStatus with ID '${command.id}' not found`);
            }

            // Check if new status code conflicts with existing one (if provided)
            if (command.updateResultStatusDto.statusCode && command.updateResultStatusDto.statusCode !== existingResultStatus.statusCode) {
                const conflictingResultStatus = await this.resultStatusRepository.findByCode(command.updateResultStatusDto.statusCode);
                if (conflictingResultStatus) {
                    throw new ConflictException(`ResultStatus with code '${command.updateResultStatusDto.statusCode}' already exists`);
                }
            }

            // Prepare update data
            const updateData: Partial<ResultStatus> = {};
            if (command.updateResultStatusDto.statusCode !== undefined) {
                updateData.statusCode = command.updateResultStatusDto.statusCode;
            }
            if (command.updateResultStatusDto.statusName !== undefined) {
                updateData.statusName = command.updateResultStatusDto.statusName;
            }
            if (command.updateResultStatusDto.orderNumber !== undefined) {
                updateData.orderNumber = command.updateResultStatusDto.orderNumber;
            }
            if (command.updateResultStatusDto.description !== undefined) {
                updateData.description = command.updateResultStatusDto.description;
            }
            if (command.updateResultStatusDto.colorCode !== undefined) {
                updateData.colorCode = command.updateResultStatusDto.colorCode;
            }
            if (command.updateResultStatusDto.isActive !== undefined) {
                updateData.isActiveFlag = command.updateResultStatusDto.isActive ? 1 : 0;
            }

            const updatedResultStatus = await this.resultStatusRepository.update(command.id, updateData);
            
            this.logger.log(`Successfully updated ResultStatus: ${updatedResultStatus.id}`);
            return updatedResultStatus;
        } catch (error) {
            this.logger.error(`Failed to update ResultStatus: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
