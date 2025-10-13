import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { GetUnitOfMeasuresQuery } from '../get-unit-of-measures.query';
import { IUnitOfMeasureRepository, UnitOfMeasureResponseDto } from '../../../domain/unit-of-measure.interface';
import { UnitOfMeasure } from '../../../domain/unit-of-measure.entity';

@QueryHandler(GetUnitOfMeasuresQuery)
export class GetUnitOfMeasuresHandler implements IQueryHandler<GetUnitOfMeasuresQuery> {
    private readonly logger = new Logger(GetUnitOfMeasuresHandler.name);

    constructor(
        @Inject('IUnitOfMeasureRepository')
        private readonly unitOfMeasureRepository: IUnitOfMeasureRepository,
    ) { }

    async execute(query: GetUnitOfMeasuresQuery): Promise<[UnitOfMeasureResponseDto[], number]> {
        this.logger.log(`Executing GetUnitOfMeasuresQuery with search: ${query.getUnitOfMeasuresDto.search}`);

        const { limit, offset, search, isActive } = query.getUnitOfMeasuresDto;

        const [unitOfMeasures, total] = await this.unitOfMeasureRepository.findAndCount(
            limit || 10,
            offset || 0,
            search,
            isActive,
        );

        const unitOfMeasureDtos: UnitOfMeasureResponseDto[] = unitOfMeasures.map((unitOfMeasure) => ({
            id: unitOfMeasure.id,
            unitOfMeasureCode: unitOfMeasure.unitOfMeasureCode,
            unitOfMeasureName: unitOfMeasure.unitOfMeasureName,
            description: unitOfMeasure.description,
            mapping: unitOfMeasure.mapping,
            isActiveFlag: unitOfMeasure.isActiveFlag,
            createdAt: unitOfMeasure.createdAt,
            updatedAt: unitOfMeasure.updatedAt,
            deletedAt: unitOfMeasure.deletedAt,
            createdBy: unitOfMeasure.createdBy,
            updatedBy: unitOfMeasure.updatedBy,
            version: unitOfMeasure.version,
        }));

        return [unitOfMeasureDtos, total];
    }
}
