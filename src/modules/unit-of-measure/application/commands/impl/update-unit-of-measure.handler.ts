import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { UnitOfMeasure } from '../../../domain/unit-of-measure.entity';
import { UpdateUnitOfMeasureCommand } from '../update-unit-of-measure.command';
import { IUnitOfMeasureRepository } from '../../../domain/unit-of-measure.interface';
import { AppError, HTTP_CLIENT_ERROR } from '../../../../../common/dtos/base-response.dto';

@CommandHandler(UpdateUnitOfMeasureCommand)
export class UpdateUnitOfMeasureHandler implements ICommandHandler<UpdateUnitOfMeasureCommand> {
    private readonly logger = new Logger(UpdateUnitOfMeasureHandler.name);

    constructor(
        @Inject('IUnitOfMeasureRepository')
        private readonly unitOfMeasureRepository: IUnitOfMeasureRepository,
    ) { }

    async execute(command: UpdateUnitOfMeasureCommand): Promise<UnitOfMeasure> {
        this.logger.log(`Executing UpdateUnitOfMeasureCommand for id: ${command.id}`);

        const { id, updateUnitOfMeasureDto } = command;
        const unitOfMeasure = await this.unitOfMeasureRepository.findById(id);

        if (!unitOfMeasure) {
            throw new AppError('Unit of measure not found', 'UOM_NOT_FOUND', HTTP_CLIENT_ERROR.NOT_FOUND);
        }

        if (updateUnitOfMeasureDto.unitOfMeasureName) {
            unitOfMeasure.unitOfMeasureName = updateUnitOfMeasureDto.unitOfMeasureName;
        }
        if (updateUnitOfMeasureDto.description !== undefined) {
            unitOfMeasure.description = updateUnitOfMeasureDto.description;
        }
        if (updateUnitOfMeasureDto.mapping !== undefined) {
            unitOfMeasure.mapping = updateUnitOfMeasureDto.mapping;
        }
        if (updateUnitOfMeasureDto.isActiveFlag !== undefined) {
            unitOfMeasure.isActiveFlag = updateUnitOfMeasureDto.isActiveFlag;
        }

        return this.unitOfMeasureRepository.save(unitOfMeasure);
    }
}
