import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, ConflictException } from '@nestjs/common';

import { CreateDepartmentCommand } from '../create-department.command';
import { Department } from '../../../domain/department.entity';
import { IDepartmentRepository } from '../../../domain/department.interface';

@CommandHandler(CreateDepartmentCommand)
export class CreateDepartmentHandler implements ICommandHandler<CreateDepartmentCommand> {
    private readonly logger = new Logger(CreateDepartmentHandler.name);

    constructor(
        @Inject('IDepartmentRepository')
        private readonly departmentRepository: IDepartmentRepository,
    ) { }

    async execute(command: CreateDepartmentCommand): Promise<Department> {
        const { createDepartmentDto } = command;
        this.logger.log(`Creating department: ${createDepartmentDto.departmentCode}`);

        // Check if department code already exists
        const existingByCode = await this.departmentRepository.findByCode(createDepartmentDto.departmentCode);
        if (existingByCode) {
            throw new ConflictException('Department code already exists');
        }

        // Check if department name already exists
        const existingByName = await this.departmentRepository.findByName(createDepartmentDto.departmentName);
        if (existingByName) {
            throw new ConflictException('Department name already exists');
        }

        // Create new department
        const department = new Department();
        department.departmentCode = createDepartmentDto.departmentCode;
        department.departmentName = createDepartmentDto.departmentName;
        department.branchId = createDepartmentDto.branchId;
        department.headOfDepartment = createDepartmentDto.headOfDepartment;
        department.headNurse = createDepartmentDto.headNurse;
        department.parentDepartmentId = createDepartmentDto.parentDepartmentId;
        department.shortName = createDepartmentDto.shortName;
        department.departmentTypeId = createDepartmentDto.departmentTypeId;
        department.isActiveFlag = createDepartmentDto.isActive ? 1 : 1; // Default to active
        department.mapping = createDepartmentDto.mapping;
        department.createdBy = 'system';

        const savedDepartment = await this.departmentRepository.save(department);
        this.logger.log(`Department created successfully: ${savedDepartment.id}`);

        return savedDepartment;
    }
}
