import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { DeleteBranchCommand } from '../delete-branch.command';
import { IBranchRepository } from '../../../domain/branch.interface';

@CommandHandler(DeleteBranchCommand)
export class DeleteBranchHandler implements ICommandHandler<DeleteBranchCommand> {
    private readonly logger = new Logger(DeleteBranchHandler.name);

    constructor(
        @Inject('IBranchRepository')
        private readonly branchRepository: IBranchRepository,
    ) { }

    async execute(command: DeleteBranchCommand): Promise<void> {
        const { id } = command;
        this.logger.log(`Deleting branch: ${id}`);

        // Check if branch exists
        const existingBranch = await this.branchRepository.findById(id);
        if (!existingBranch) {
            throw new NotFoundException('Branch not found');
        }

        // Soft delete the branch
        await this.branchRepository.delete(id);
        this.logger.log(`Branch deleted successfully: ${id}`);
    }
}
