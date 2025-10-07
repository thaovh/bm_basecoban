import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException, ConflictException } from '@nestjs/common';

import { UpdateWardCommand } from '../update-ward.command';
import { Ward } from '../../../domain/ward.entity';
import { IWardRepository } from '../../../domain/ward.interface';
import { IProvinceRepository } from '../../../../province/domain/province.interface';

@CommandHandler(UpdateWardCommand)
export class UpdateWardHandler implements ICommandHandler<UpdateWardCommand> {
    private readonly logger = new Logger(UpdateWardHandler.name);

    constructor(
        @Inject('IWardRepository')
        private readonly wardRepository: IWardRepository,
        @Inject('IProvinceRepository')
        private readonly provinceRepository: IProvinceRepository,
    ) {}

    async execute(command: UpdateWardCommand): Promise<Ward> {
        const { id, updateWardDto } = command;
        this.logger.log(`Updating ward: ${id}`);

        // Find existing ward
        const existingWard = await this.wardRepository.findById(id);
        if (!existingWard) {
            throw new NotFoundException('Ward not found');
        }

        // Check if province exists (if being updated)
        if (updateWardDto.provinceId && updateWardDto.provinceId !== existingWard.provinceId) {
            const province = await this.provinceRepository.findById(updateWardDto.provinceId);
            if (!province) {
                throw new NotFoundException('Province not found');
            }
        }

        // Check if ward code already exists (if being updated)
        if (updateWardDto.wardCode && updateWardDto.wardCode !== existingWard.wardCode) {
            const existingByCode = await this.wardRepository.findByCode(updateWardDto.wardCode);
            if (existingByCode) {
                throw new ConflictException('Ward code already exists');
            }
        }

        // Update ward fields
        if (updateWardDto.wardCode) {
            existingWard.wardCode = updateWardDto.wardCode;
        }
        if (updateWardDto.wardName) {
            existingWard.wardName = updateWardDto.wardName;
        }
        if (updateWardDto.provinceId) {
            existingWard.provinceId = updateWardDto.provinceId;
        }
        if (updateWardDto.isActive !== undefined) {
            existingWard.isActive = updateWardDto.isActive ? 1 : 0;
        }
        existingWard.updatedBy = 'system';

        const updatedWard = await this.wardRepository.save(existingWard);
        this.logger.log(`Ward updated successfully: ${updatedWard.id}`);

        return updatedWard;
    }
}
