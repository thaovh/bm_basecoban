import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, ConflictException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateResultStatusCommand } from '../create-result-status.command';
import { ResultStatus } from '../../../domain/result-status.entity';
import { IResultStatusRepository } from '../../../domain/result-status.interface';

@CommandHandler(CreateResultStatusCommand)
export class CreateResultStatusHandler implements ICommandHandler<CreateResultStatusCommand> {
    private readonly logger = new Logger(CreateResultStatusHandler.name);

    constructor(
        @Inject('IResultStatusRepository')
        private readonly resultStatusRepository: IResultStatusRepository,
    ) {}

    async execute(command: CreateResultStatusCommand): Promise<ResultStatus> {
        this.logger.log(`Executing CreateResultStatusCommand for status code: ${command.createResultStatusDto.statusCode}`);
        
        try {
            // Check if status code already exists
            const existingResultStatus = await this.resultStatusRepository.findByCode(command.createResultStatusDto.statusCode);
            if (existingResultStatus) {
                throw new ConflictException(`ResultStatus with code '${command.createResultStatusDto.statusCode}' already exists`);
            }

            // Create new ResultStatus
            const resultStatus = new ResultStatus();
            resultStatus.id = uuidv4();
            resultStatus.statusCode = command.createResultStatusDto.statusCode;
            resultStatus.statusName = command.createResultStatusDto.statusName;
            resultStatus.orderNumber = command.createResultStatusDto.orderNumber;
            resultStatus.description = command.createResultStatusDto.description;
            resultStatus.colorCode = command.createResultStatusDto.colorCode;
            resultStatus.isActiveFlag = command.createResultStatusDto.isActive ? 1 : 0;

            const savedResultStatus = await this.resultStatusRepository.save(resultStatus);
            
            this.logger.log(`Successfully created ResultStatus: ${savedResultStatus.id}`);
            return savedResultStatus;
        } catch (error) {
            this.logger.error(`Failed to create ResultStatus: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
