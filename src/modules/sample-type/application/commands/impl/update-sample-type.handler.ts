import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException, ConflictException } from '@nestjs/common';

import { UpdateSampleTypeCommand } from '../update-sample-type.command';
import { SampleType } from '../../../domain/sample-type.entity';
import { ISampleTypeRepository } from '../../../domain/sample-type.interface';

@CommandHandler(UpdateSampleTypeCommand)
export class UpdateSampleTypeHandler implements ICommandHandler<UpdateSampleTypeCommand> {
    private readonly logger = new Logger(UpdateSampleTypeHandler.name);

    constructor(
        @Inject('ISampleTypeRepository')
        private readonly sampleTypeRepository: ISampleTypeRepository,
    ) { }

    async execute(command: UpdateSampleTypeCommand): Promise<SampleType> {
        const { id, updateSampleTypeDto } = command;
        this.logger.log(`Updating sample type: ${id}`);

        // Find existing sample type
        const existingSampleType = await this.sampleTypeRepository.findById(id);
        if (!existingSampleType) {
            throw new NotFoundException('Sample type not found');
        }

        // Check if sample type code already exists (if being updated)
        if (updateSampleTypeDto.typeCode && updateSampleTypeDto.typeCode !== existingSampleType.typeCode) {
            const existingByCode = await this.sampleTypeRepository.findByCode(updateSampleTypeDto.typeCode);
            if (existingByCode) {
                throw new ConflictException('Sample type code already exists');
            }
        }

        // Check if sample type name already exists (if being updated)
        if (updateSampleTypeDto.typeName && updateSampleTypeDto.typeName !== existingSampleType.typeName) {
            const existingByName = await this.sampleTypeRepository.findByName(updateSampleTypeDto.typeName);
            if (existingByName) {
                throw new ConflictException('Sample type name already exists');
            }
        }

        // Validate code generation rule if provided
        if (updateSampleTypeDto.codeGenerationRule) {
            try {
                JSON.parse(updateSampleTypeDto.codeGenerationRule);
            } catch (error) {
                throw new ConflictException('Invalid code generation rule format. Must be valid JSON.');
            }
        }

        // Update sample type fields
        if (updateSampleTypeDto.typeCode) {
            existingSampleType.typeCode = updateSampleTypeDto.typeCode;
        }
        if (updateSampleTypeDto.typeName) {
            existingSampleType.typeName = updateSampleTypeDto.typeName;
        }
        if (updateSampleTypeDto.shortName !== undefined) {
            existingSampleType.shortName = updateSampleTypeDto.shortName;
        }
        if (updateSampleTypeDto.codeGenerationRule !== undefined) {
            existingSampleType.codeGenerationRule = updateSampleTypeDto.codeGenerationRule;
        }
        if (updateSampleTypeDto.description !== undefined) {
            existingSampleType.description = updateSampleTypeDto.description;
        }
        if (updateSampleTypeDto.isActive !== undefined) {
            existingSampleType.isActiveFlag = updateSampleTypeDto.isActive ? 1 : 0;
        }
        existingSampleType.updatedBy = 'system';

        const updatedSampleType = await this.sampleTypeRepository.save(existingSampleType);
        this.logger.log(`Sample type updated successfully: ${updatedSampleType.id}`);

        return updatedSampleType;
    }
}
