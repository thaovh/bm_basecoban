import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { DeleteDepartmentCommand } from '../delete-department.command';
import { IDepartmentRepository } from '../../../domain/department.interface';

@CommandHandler(DeleteDepartmentCommand)
export class DeleteDepartmentHandler implements ICommandHandler<DeleteDepartmentCommand> {
    private readonly logger = new Logger(DeleteDepartmentHandler.name);

    constructor(
        @Inject('IDepartmentRepository')
        private readonly departmentRepository: IDepartmentRepository,
    ) { }

    async execute(command: DeleteDepartmentCommand): Promise<void> {
        const { id } = command;
        this.logger.log(`Deleting department: ${id}`);

        // Check if department exists
        const existingDepartment = await this.departmentRepository.findById(id);
        if (!existingDepartment) {
            throw new NotFoundException('Department not found');
        }

        // Soft delete the department
        await this.departmentRepository.delete(id);
        this.logger.log(`Department deleted successfully: ${id}`);
    }
}
