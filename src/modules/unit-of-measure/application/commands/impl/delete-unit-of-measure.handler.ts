import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { DeleteUnitOfMeasureCommand } from '../delete-unit-of-measure.command';
import { IUnitOfMeasureRepository } from '../../../domain/unit-of-measure.interface';
import { AppError, HTTP_CLIENT_ERROR } from '../../../../../common/dtos/base-response.dto';

@CommandHandler(DeleteUnitOfMeasureCommand)
export class DeleteUnitOfMeasureHandler implements ICommandHandler<DeleteUnitOfMeasureCommand> {
    private readonly logger = new Logger(DeleteUnitOfMeasureHandler.name);

    constructor(
        @Inject('IUnitOfMeasureRepository')
        private readonly unitOfMeasureRepository: IUnitOfMeasureRepository,
    ) { }

    async execute(command: DeleteUnitOfMeasureCommand): Promise<void> {
        this.logger.log(`Executing DeleteUnitOfMeasureCommand for id: ${command.id}`);

        const unitOfMeasure = await this.unitOfMeasureRepository.findById(command.id);

        if (!unitOfMeasure) {
            throw new AppError('Unit of measure not found', 'UOM_NOT_FOUND', HTTP_CLIENT_ERROR.NOT_FOUND);
        }

        await this.unitOfMeasureRepository.delete(command.id);
    }
}
