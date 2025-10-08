import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, ConflictException } from '@nestjs/common';

import { CreateDepartmentTypeCommand } from '../create-department-type.command';
import { DepartmentType } from '../../../domain/department-type.entity';
import { IDepartmentTypeRepository } from '../../../domain/department-type.interface';

@CommandHandler(CreateDepartmentTypeCommand)
export class CreateDepartmentTypeHandler implements ICommandHandler<CreateDepartmentTypeCommand> {
    private readonly logger = new Logger(CreateDepartmentTypeHandler.name);

    constructor(
        @Inject('IDepartmentTypeRepository')
        private readonly departmentTypeRepository: IDepartmentTypeRepository,
    ) { }

    async execute(command: CreateDepartmentTypeCommand): Promise<DepartmentType> {
        const { createDepartmentTypeDto } = command;
        this.logger.log(`Creating department type: ${createDepartmentTypeDto.typeCode}`);

        // Check if department type code already exists
        const existingByCode = await this.departmentTypeRepository.findByCode(createDepartmentTypeDto.typeCode);
        if (existingByCode) {
            throw new ConflictException('Department type code already exists');
        }

        // Check if department type name already exists
        const existingByName = await this.departmentTypeRepository.findByName(createDepartmentTypeDto.typeName);
        if (existingByName) {
            throw new ConflictException('Department type name already exists');
        }

        // Create new department type
        const departmentType = new DepartmentType();
        departmentType.typeCode = createDepartmentTypeDto.typeCode;
        departmentType.typeName = createDepartmentTypeDto.typeName;
        departmentType.description = createDepartmentTypeDto.description;
        departmentType.isActiveFlag = createDepartmentTypeDto.isActive ? 1 : 1; // Default to active
        departmentType.createdBy = 'system';

        const savedDepartmentType = await this.departmentTypeRepository.save(departmentType);
        this.logger.log(`Department type created successfully: ${savedDepartmentType.id}`);

        return savedDepartmentType;
    }
}
