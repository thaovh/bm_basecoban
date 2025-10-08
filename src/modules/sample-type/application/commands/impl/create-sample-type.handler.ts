import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, ConflictException } from '@nestjs/common';

import { CreateSampleTypeCommand } from '../create-sample-type.command';
import { SampleType } from '../../../domain/sample-type.entity';
import { ISampleTypeRepository } from '../../../domain/sample-type.interface';

@CommandHandler(CreateSampleTypeCommand)
export class CreateSampleTypeHandler implements ICommandHandler<CreateSampleTypeCommand> {
    private readonly logger = new Logger(CreateSampleTypeHandler.name);

    constructor(
        @Inject('ISampleTypeRepository')
        private readonly sampleTypeRepository: ISampleTypeRepository,
    ) { }

    async execute(command: CreateSampleTypeCommand): Promise<SampleType> {
        const { createSampleTypeDto } = command;
        this.logger.log(`Creating sample type: ${createSampleTypeDto.typeCode}`);

        // Check if sample type code already exists
        const existingByCode = await this.sampleTypeRepository.findByCode(createSampleTypeDto.typeCode);
        if (existingByCode) {
            throw new ConflictException('Sample type code already exists');
        }

        // Check if sample type name already exists
        const existingByName = await this.sampleTypeRepository.findByName(createSampleTypeDto.typeName);
        if (existingByName) {
            throw new ConflictException('Sample type name already exists');
        }

        // Validate code generation rule if provided
        if (createSampleTypeDto.codeGenerationRule) {
            try {
                JSON.parse(createSampleTypeDto.codeGenerationRule);
            } catch (error) {
                throw new ConflictException('Invalid code generation rule format. Must be valid JSON.');
            }
        }

        // Create new sample type
        const sampleType = new SampleType();
        sampleType.typeCode = createSampleTypeDto.typeCode;
        sampleType.typeName = createSampleTypeDto.typeName;
        sampleType.shortName = createSampleTypeDto.shortName;
        sampleType.codeGenerationRule = createSampleTypeDto.codeGenerationRule;
        sampleType.description = createSampleTypeDto.description;
        sampleType.isActiveFlag = createSampleTypeDto.isActive ? 1 : 1; // Default to active
        sampleType.createdBy = 'system';

        const savedSampleType = await this.sampleTypeRepository.save(sampleType);
        this.logger.log(`Sample type created successfully: ${savedSampleType.id}`);

        return savedSampleType;
    }
}
