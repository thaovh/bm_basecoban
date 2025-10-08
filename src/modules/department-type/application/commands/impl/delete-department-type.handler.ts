import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { DeleteDepartmentTypeCommand } from '../delete-department-type.command';
import { IDepartmentTypeRepository } from '../../../domain/department-type.interface';

@CommandHandler(DeleteDepartmentTypeCommand)
export class DeleteDepartmentTypeHandler implements ICommandHandler<DeleteDepartmentTypeCommand> {
    private readonly logger = new Logger(DeleteDepartmentTypeHandler.name);

    constructor(
        @Inject('IDepartmentTypeRepository')
        private readonly departmentTypeRepository: IDepartmentTypeRepository,
    ) { }

    async execute(command: DeleteDepartmentTypeCommand): Promise<void> {
        const { id } = command;
        this.logger.log(`Deleting department type: ${id}`);

        // Check if department type exists
        const existingDepartmentType = await this.departmentTypeRepository.findById(id);
        if (!existingDepartmentType) {
            throw new NotFoundException('Department type not found');
        }

        // Soft delete the department type
        await this.departmentTypeRepository.delete(id);
        this.logger.log(`Department type deleted successfully: ${id}`);
    }
}
