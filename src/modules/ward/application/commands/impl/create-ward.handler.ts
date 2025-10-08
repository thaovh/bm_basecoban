import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, ConflictException, NotFoundException } from '@nestjs/common';

import { CreateWardCommand } from '../create-ward.command';
import { Ward } from '../../../domain/ward.entity';
import { IWardRepository } from '../../../domain/ward.interface';
import { IProvinceRepository } from '../../../../province/domain/province.interface';

@CommandHandler(CreateWardCommand)
export class CreateWardHandler implements ICommandHandler<CreateWardCommand> {
    private readonly logger = new Logger(CreateWardHandler.name);

    constructor(
        @Inject('IWardRepository')
        private readonly wardRepository: IWardRepository,
        @Inject('IProvinceRepository')
        private readonly provinceRepository: IProvinceRepository,
    ) { }

    async execute(command: CreateWardCommand): Promise<Ward> {
        const { createWardDto } = command;
        this.logger.log(`Creating ward: ${createWardDto.wardName}`);

        // Check if province exists
        const province = await this.provinceRepository.findById(createWardDto.provinceId);
        if (!province) {
            throw new NotFoundException('Province not found');
        }

        // Check if ward code already exists
        const existingByCode = await this.wardRepository.findByCode(createWardDto.wardCode);
        if (existingByCode) {
            throw new ConflictException('Ward code already exists');
        }

        // Create new ward
        const ward = new Ward();
        ward.wardCode = createWardDto.wardCode;
        ward.wardName = createWardDto.wardName;
        ward.shortName = createWardDto.shortName;
        ward.provinceId = createWardDto.provinceId;
        ward.isActiveFlag = createWardDto.isActive ? 1 : 1; // Default to active
        ward.createdBy = 'system';

        const savedWard = await this.wardRepository.save(ward);
        this.logger.log(`Ward created successfully: ${savedWard.id}`);

        return savedWard;
    }
}
