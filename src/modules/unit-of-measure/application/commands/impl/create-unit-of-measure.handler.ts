import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { UnitOfMeasure } from '../../../domain/unit-of-measure.entity';
import { CreateUnitOfMeasureCommand } from '../create-unit-of-measure.command';
import { IUnitOfMeasureRepository } from '../../../domain/unit-of-measure.interface';
import { AppError, HTTP_CLIENT_ERROR } from '../../../../../common/dtos/base-response.dto';

@CommandHandler(CreateUnitOfMeasureCommand)
export class CreateUnitOfMeasureHandler implements ICommandHandler<CreateUnitOfMeasureCommand> {
    private readonly logger = new Logger(CreateUnitOfMeasureHandler.name);

    constructor(
        @Inject('IUnitOfMeasureRepository')
        private readonly unitOfMeasureRepository: IUnitOfMeasureRepository,
    ) { }

    async execute(command: CreateUnitOfMeasureCommand): Promise<UnitOfMeasure> {
        this.logger.log(`Executing CreateUnitOfMeasureCommand for code: ${command.createUnitOfMeasureDto.unitOfMeasureCode}`);

        const { unitOfMeasureCode, unitOfMeasureName, description, mapping, isActiveFlag } = command.createUnitOfMeasureDto;

        const existingUnitOfMeasure = await this.unitOfMeasureRepository.findByCode(unitOfMeasureCode);
        if (existingUnitOfMeasure) {
            throw new AppError('Unit of measure code already exists', 'UOM_CODE_CONFLICT', HTTP_CLIENT_ERROR.CONFLICT);
        }

        const newUnitOfMeasure = new UnitOfMeasure();
        newUnitOfMeasure.unitOfMeasureCode = unitOfMeasureCode;
        newUnitOfMeasure.unitOfMeasureName = unitOfMeasureName;
        newUnitOfMeasure.description = description;
        newUnitOfMeasure.mapping = mapping;
        newUnitOfMeasure.isActiveFlag = isActiveFlag ?? 1;

        return this.unitOfMeasureRepository.save(newUnitOfMeasure);
    }
}
