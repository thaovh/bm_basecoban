import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException, ConflictException } from '@nestjs/common';

import { UpdateBranchCommand } from '../update-branch.command';
import { Branch } from '../../../domain/branch.entity';
import { IBranchRepository } from '../../../domain/branch.interface';

@CommandHandler(UpdateBranchCommand)
export class UpdateBranchHandler implements ICommandHandler<UpdateBranchCommand> {
    private readonly logger = new Logger(UpdateBranchHandler.name);

    constructor(
        @Inject('IBranchRepository')
        private readonly branchRepository: IBranchRepository,
    ) { }

    async execute(command: UpdateBranchCommand): Promise<Branch> {
        const { id, updateBranchDto } = command;
        this.logger.log(`Updating branch: ${id}`);

        // Find existing branch
        const existingBranch = await this.branchRepository.findById(id);
        if (!existingBranch) {
            throw new NotFoundException('Branch not found');
        }

        // Check if branch code already exists (if being updated)
        if (updateBranchDto.branchCode && updateBranchDto.branchCode !== existingBranch.branchCode) {
            const existingByCode = await this.branchRepository.findByCode(updateBranchDto.branchCode);
            if (existingByCode) {
                throw new ConflictException('Branch code already exists');
            }
        }

        // Check if branch name already exists (if being updated)
        if (updateBranchDto.branchName && updateBranchDto.branchName !== existingBranch.branchName) {
            const existingByName = await this.branchRepository.findByName(updateBranchDto.branchName);
            if (existingByName) {
                throw new ConflictException('Branch name already exists');
            }
        }

        // Update branch fields
        if (updateBranchDto.branchCode) {
            existingBranch.branchCode = updateBranchDto.branchCode;
        }
        if (updateBranchDto.branchName) {
            existingBranch.branchName = updateBranchDto.branchName;
        }
        if (updateBranchDto.shortName !== undefined) {
            existingBranch.shortName = updateBranchDto.shortName;
        }
        if (updateBranchDto.provinceId) {
            existingBranch.provinceId = updateBranchDto.provinceId;
        }
        if (updateBranchDto.wardId) {
            existingBranch.wardId = updateBranchDto.wardId;
        }
        if (updateBranchDto.address) {
            existingBranch.address = updateBranchDto.address;
        }
        if (updateBranchDto.phoneNumber !== undefined) {
            existingBranch.phoneNumber = updateBranchDto.phoneNumber;
        }
        if (updateBranchDto.hospitalLevel !== undefined) {
            existingBranch.hospitalLevel = updateBranchDto.hospitalLevel;
        }
        if (updateBranchDto.representative !== undefined) {
            existingBranch.representative = updateBranchDto.representative;
        }
        if (updateBranchDto.bhytCode !== undefined) {
            existingBranch.bhytCode = updateBranchDto.bhytCode;
        }
        if (updateBranchDto.isActive !== undefined) {
            existingBranch.isActiveFlag = updateBranchDto.isActive ? 1 : 0;
        }
        existingBranch.updatedBy = 'system';

        const updatedBranch = await this.branchRepository.save(existingBranch);
        this.logger.log(`Branch updated successfully: ${updatedBranch.id}`);

        return updatedBranch;
    }
}
