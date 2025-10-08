import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { GetSampleTypesQuery } from '../get-sample-types.query';
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

export interface GetSampleTypesResult {
    items: SampleTypeResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

@QueryHandler(GetSampleTypesQuery)
export class GetSampleTypesHandler implements IQueryHandler<GetSampleTypesQuery> {
    private readonly logger = new Logger(GetSampleTypesHandler.name);

    constructor(
        @Inject('ISampleTypeRepository')
        private readonly sampleTypeRepository: ISampleTypeRepository,
    ) { }

    async execute(query: GetSampleTypesQuery): Promise<GetSampleTypesResult> {
        const { getSampleTypesDto } = query;
        const { search, isActive, limit = 10, offset = 0 } = getSampleTypesDto;

        this.logger.log(`Getting sample types with filters: search=${search}, isActive=${isActive}`);

        let sampleTypes: SampleType[];
        let total: number;

        if (search) {
            // Search sample types by name or code
            [sampleTypes, total] = await this.sampleTypeRepository.searchSampleTypes(search, limit, offset);
        } else if (isActive !== undefined) {
            // Filter by active status
            if (isActive) {
                [sampleTypes, total] = await this.sampleTypeRepository.findActiveSampleTypes(limit, offset);
            } else {
                [sampleTypes, total] = await this.sampleTypeRepository.findAllSampleTypes(limit, offset);
            }
        } else {
            // Get all sample types
            [sampleTypes, total] = await this.sampleTypeRepository.findAllSampleTypes(limit, offset);
        }

        const items: SampleTypeResponseDto[] = sampleTypes.map(sampleType => ({
            id: sampleType.id,
            typeCode: sampleType.typeCode,
            typeName: sampleType.typeName,
            shortName: sampleType.shortName,
            codeGenerationRule: sampleType.codeGenerationRule,
            description: sampleType.description,
            isActive: sampleType.isActiveFlag,
            createdAt: sampleType.createdAt,
            updatedAt: sampleType.updatedAt,
        }));

        return {
            items,
            total,
            limit,
            offset,
        };
    }
}
