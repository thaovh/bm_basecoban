import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, ConflictException } from '@nestjs/common';

import { CreateBranchCommand } from '../create-branch.command';
import { Branch } from '../../../domain/branch.entity';
import { IBranchRepository } from '../../../domain/branch.interface';

@CommandHandler(CreateBranchCommand)
export class CreateBranchHandler implements ICommandHandler<CreateBranchCommand> {
    private readonly logger = new Logger(CreateBranchHandler.name);

    constructor(
        @Inject('IBranchRepository')
        private readonly branchRepository: IBranchRepository,
    ) { }

    async execute(command: CreateBranchCommand): Promise<Branch> {
        const { createBranchDto } = command;
        this.logger.log(`Creating branch: ${createBranchDto.branchCode}`);

        // Check if branch code already exists
        const existingByCode = await this.branchRepository.findByCode(createBranchDto.branchCode);
        if (existingByCode) {
            throw new ConflictException('Branch code already exists');
        }

        // Check if branch name already exists
        const existingByName = await this.branchRepository.findByName(createBranchDto.branchName);
        if (existingByName) {
            throw new ConflictException('Branch name already exists');
        }

        // Create new branch
        const branch = new Branch();
        branch.branchCode = createBranchDto.branchCode;
        branch.branchName = createBranchDto.branchName;
        branch.shortName = createBranchDto.shortName;
        branch.provinceId = createBranchDto.provinceId;
        branch.wardId = createBranchDto.wardId;
        branch.address = createBranchDto.address;
        branch.phoneNumber = createBranchDto.phoneNumber;
        branch.hospitalLevel = createBranchDto.hospitalLevel;
        branch.representative = createBranchDto.representative;
        branch.bhytCode = createBranchDto.bhytCode;
        branch.isActiveFlag = createBranchDto.isActive ? 1 : 1; // Default to active
        branch.createdBy = 'system';

        const savedBranch = await this.branchRepository.save(branch);
        this.logger.log(`Branch created successfully: ${savedBranch.id}`);

        return savedBranch;
    }
}
