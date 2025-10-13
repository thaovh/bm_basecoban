import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { GetUnitOfMeasureByIdQuery } from '../get-unit-of-measure-by-id.query';
import { IUnitOfMeasureRepository } from '../../../domain/unit-of-measure.interface';
import { AppError, HTTP_CLIENT_ERROR } from '../../../../../common/dtos/base-response.dto';
import { UnitOfMeasure } from '../../../domain/unit-of-measure.entity';

@QueryHandler(GetUnitOfMeasureByIdQuery)
export class GetUnitOfMeasureByIdHandler implements IQueryHandler<GetUnitOfMeasureByIdQuery> {
    private readonly logger = new Logger(GetUnitOfMeasureByIdHandler.name);

    constructor(
        @Inject('IUnitOfMeasureRepository')
        private readonly unitOfMeasureRepository: IUnitOfMeasureRepository,
    ) { }

    async execute(query: GetUnitOfMeasureByIdQuery): Promise<UnitOfMeasure> {
        this.logger.log(`Executing GetUnitOfMeasureByIdQuery for id: ${query.id}`);

        const unitOfMeasure = await this.unitOfMeasureRepository.findById(query.id);

        if (!unitOfMeasure) {
            throw new AppError('Unit of measure not found', 'UOM_NOT_FOUND', HTTP_CLIENT_ERROR.NOT_FOUND);
        }

        return unitOfMeasure;
    }
}
