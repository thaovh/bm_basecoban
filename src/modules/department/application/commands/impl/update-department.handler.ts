import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException, ConflictException } from '@nestjs/common';

import { UpdateDepartmentCommand } from '../update-department.command';
import { Department } from '../../../domain/department.entity';
import { IDepartmentRepository } from '../../../domain/department.interface';

@CommandHandler(UpdateDepartmentCommand)
export class UpdateDepartmentHandler implements ICommandHandler<UpdateDepartmentCommand> {
    private readonly logger = new Logger(UpdateDepartmentHandler.name);

    constructor(
        @Inject('IDepartmentRepository')
        private readonly departmentRepository: IDepartmentRepository,
    ) { }

    async execute(command: UpdateDepartmentCommand): Promise<Department> {
        const { id, updateDepartmentDto } = command;
        this.logger.log(`Updating department: ${id}`);

        // Find existing department
        const existingDepartment = await this.departmentRepository.findById(id);
        if (!existingDepartment) {
            throw new NotFoundException('Department not found');
        }

        // Check if department code already exists (if being updated)
        if (updateDepartmentDto.departmentCode && updateDepartmentDto.departmentCode !== existingDepartment.departmentCode) {
            const existingByCode = await this.departmentRepository.findByCode(updateDepartmentDto.departmentCode);
            if (existingByCode) {
                throw new ConflictException('Department code already exists');
            }
        }

        // Check if department name already exists (if being updated)
        if (updateDepartmentDto.departmentName && updateDepartmentDto.departmentName !== existingDepartment.departmentName) {
            const existingByName = await this.departmentRepository.findByName(updateDepartmentDto.departmentName);
            if (existingByName) {
                throw new ConflictException('Department name already exists');
            }
        }

        // Update department fields
        if (updateDepartmentDto.departmentCode) {
            existingDepartment.departmentCode = updateDepartmentDto.departmentCode;
        }
        if (updateDepartmentDto.departmentName) {
            existingDepartment.departmentName = updateDepartmentDto.departmentName;
        }
        if (updateDepartmentDto.branchId) {
            existingDepartment.branchId = updateDepartmentDto.branchId;
        }
        if (updateDepartmentDto.headOfDepartment !== undefined) {
            existingDepartment.headOfDepartment = updateDepartmentDto.headOfDepartment;
        }
        if (updateDepartmentDto.headNurse !== undefined) {
            existingDepartment.headNurse = updateDepartmentDto.headNurse;
        }
        if (updateDepartmentDto.parentDepartmentId !== undefined) {
            existingDepartment.parentDepartmentId = updateDepartmentDto.parentDepartmentId;
        }
        if (updateDepartmentDto.shortName !== undefined) {
            existingDepartment.shortName = updateDepartmentDto.shortName;
        }
        if (updateDepartmentDto.departmentTypeId) {
            existingDepartment.departmentTypeId = updateDepartmentDto.departmentTypeId;
        }
        if (updateDepartmentDto.isActive !== undefined) {
            existingDepartment.isActiveFlag = updateDepartmentDto.isActive ? 1 : 0;
        }
        if (updateDepartmentDto.mapping !== undefined) {
            existingDepartment.mapping = updateDepartmentDto.mapping;
        }
        existingDepartment.updatedBy = 'system';

        const updatedDepartment = await this.departmentRepository.save(existingDepartment);
        this.logger.log(`Department updated successfully: ${updatedDepartment.id}`);

        return updatedDepartment;
    }
}
