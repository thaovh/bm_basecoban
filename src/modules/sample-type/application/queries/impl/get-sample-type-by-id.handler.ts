import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { GetSampleTypeByIdQuery } from '../get-sample-type-by-id.query';
import { SampleType } from '../../../domain/sample-type.entity';
import { ISampleTypeRepository } from '../../../domain/sample-type.interface';

export interface SampleTypeResponseDto {
    id: string;
    typeCode: string;
    typeName: string;
    shortName?: string;
    codeGenerationRule?: string;
    description?: string;
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
}

@QueryHandler(GetSampleTypeByIdQuery)
export class GetSampleTypeByIdHandler implements IQueryHandler<GetSampleTypeByIdQuery> {
    private readonly logger = new Logger(GetSampleTypeByIdHandler.name);

    constructor(
        @Inject('ISampleTypeRepository')
        private readonly sampleTypeRepository: ISampleTypeRepository,
    ) { }

    async execute(query: GetSampleTypeByIdQuery): Promise<SampleTypeResponseDto> {
        const { id } = query;
        this.logger.log(`Getting sample type by ID: ${id}`);

        const sampleType = await this.sampleTypeRepository.findById(id);
        if (!sampleType) {
            throw new NotFoundException('Sample type not found');
        }

        return {
            id: sampleType.id,
            typeCode: sampleType.typeCode,
            typeName: sampleType.typeName,
            shortName: sampleType.shortName,
            codeGenerationRule: sampleType.codeGenerationRule,
            description: sampleType.description,
            isActive: sampleType.isActiveFlag,
            createdAt: sampleType.createdAt,
            updatedAt: sampleType.updatedAt,
        };
    }
}
