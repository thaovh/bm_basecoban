import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { GenerateSampleCodeQuery } from '../generate-sample-code.query';
import { ISampleTypeRepository } from '../../../domain/sample-type.interface';

export interface GenerateSampleCodeResult {
    sampleCode: string;
    typeCode: string;
    sequence: number;
}

@QueryHandler(GenerateSampleCodeQuery)
export class GenerateSampleCodeHandler implements IQueryHandler<GenerateSampleCodeQuery> {
    private readonly logger = new Logger(GenerateSampleCodeHandler.name);

    constructor(
        @Inject('ISampleTypeRepository')
        private readonly sampleTypeRepository: ISampleTypeRepository,
    ) { }

    async execute(query: GenerateSampleCodeQuery): Promise<GenerateSampleCodeResult> {
        const { typeCode, sequence } = query;
        this.logger.log(`Generating sample code for type: ${typeCode}, sequence: ${sequence}`);

        // Find sample type by code
        const sampleType = await this.sampleTypeRepository.findByCode(typeCode);
        if (!sampleType) {
            throw new NotFoundException('Sample type not found');
        }

        // Generate sample code using the sample type's rule
        const sampleCode = sampleType.generateSampleCode(sequence);

        return {
            sampleCode,
            typeCode,
            sequence,
        };
    }
}
