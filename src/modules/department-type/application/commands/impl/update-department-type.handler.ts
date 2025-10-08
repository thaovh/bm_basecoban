import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException, ConflictException } from '@nestjs/common';

import { UpdateDepartmentTypeCommand } from '../update-department-type.command';
import { DepartmentType } from '../../../domain/department-type.entity';
import { IDepartmentTypeRepository } from '../../../domain/department-type.interface';

@CommandHandler(UpdateDepartmentTypeCommand)
export class UpdateDepartmentTypeHandler implements ICommandHandler<UpdateDepartmentTypeCommand> {
    private readonly logger = new Logger(UpdateDepartmentTypeHandler.name);

    constructor(
        @Inject('IDepartmentTypeRepository')
        private readonly departmentTypeRepository: IDepartmentTypeRepository,
    ) { }

    async execute(command: UpdateDepartmentTypeCommand): Promise<DepartmentType> {
        const { id, updateDepartmentTypeDto } = command;
        this.logger.log(`Updating department type: ${id}`);

        // Find existing department type
        const existingDepartmentType = await this.departmentTypeRepository.findById(id);
        if (!existingDepartmentType) {
            throw new NotFoundException('Department type not found');
        }

        // Check if department type code already exists (if being updated)
        if (updateDepartmentTypeDto.typeCode && updateDepartmentTypeDto.typeCode !== existingDepartmentType.typeCode) {
            const existingByCode = await this.departmentTypeRepository.findByCode(updateDepartmentTypeDto.typeCode);
            if (existingByCode) {
                throw new ConflictException('Department type code already exists');
            }
        }

        // Check if department type name already exists (if being updated)
        if (updateDepartmentTypeDto.typeName && updateDepartmentTypeDto.typeName !== existingDepartmentType.typeName) {
            const existingByName = await this.departmentTypeRepository.findByName(updateDepartmentTypeDto.typeName);
            if (existingByName) {
                throw new ConflictException('Department type name already exists');
            }
        }

        // Update department type fields
        if (updateDepartmentTypeDto.typeCode) {
            existingDepartmentType.typeCode = updateDepartmentTypeDto.typeCode;
        }
        if (updateDepartmentTypeDto.typeName) {
            existingDepartmentType.typeName = updateDepartmentTypeDto.typeName;
        }
        if (updateDepartmentTypeDto.description !== undefined) {
            existingDepartmentType.description = updateDepartmentTypeDto.description;
        }
        if (updateDepartmentTypeDto.isActive !== undefined) {
            existingDepartmentType.isActiveFlag = updateDepartmentTypeDto.isActive ? 1 : 0;
        }
        existingDepartmentType.updatedBy = 'system';

        const updatedDepartmentType = await this.departmentTypeRepository.save(existingDepartmentType);
        this.logger.log(`Department type updated successfully: ${updatedDepartmentType.id}`);

        return updatedDepartmentType;
    }
}
