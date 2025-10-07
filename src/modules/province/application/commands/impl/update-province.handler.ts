import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException, ConflictException } from '@nestjs/common';

import { UpdateProvinceCommand } from '../update-province.command';
import { Province } from '../../../domain/province.entity';
import { IProvinceRepository } from '../../../domain/province.interface';

@CommandHandler(UpdateProvinceCommand)
export class UpdateProvinceHandler implements ICommandHandler<UpdateProvinceCommand> {
    private readonly logger = new Logger(UpdateProvinceHandler.name);

    constructor(
        @Inject('IProvinceRepository')
        private readonly provinceRepository: IProvinceRepository,
    ) { }

    async execute(command: UpdateProvinceCommand): Promise<Province> {
        const { id, updateProvinceDto } = command;
        this.logger.log(`Updating province: ${id}`);

        // Find existing province
        const existingProvince = await this.provinceRepository.findById(id);
        if (!existingProvince) {
            throw new NotFoundException('Province not found');
        }

        // Check if province code already exists (if being updated)
        if (updateProvinceDto.provinceCode && updateProvinceDto.provinceCode !== existingProvince.provinceCode) {
            const existingByCode = await this.provinceRepository.findByCode(updateProvinceDto.provinceCode);
            if (existingByCode) {
                throw new ConflictException('Province code already exists');
            }
        }

        // Check if province name already exists (if being updated)
        if (updateProvinceDto.provinceName && updateProvinceDto.provinceName !== existingProvince.provinceName) {
            const existingByName = await this.provinceRepository.findByName(updateProvinceDto.provinceName);
            if (existingByName) {
                throw new ConflictException('Province name already exists');
            }
        }

        // Update province fields
        if (updateProvinceDto.provinceCode) {
            existingProvince.provinceCode = updateProvinceDto.provinceCode;
        }
        if (updateProvinceDto.provinceName) {
            existingProvince.provinceName = updateProvinceDto.provinceName;
        }
        if (updateProvinceDto.isActive !== undefined) {
            existingProvince.isActive = updateProvinceDto.isActive ? 1 : 0;
        }
        existingProvince.updatedBy = 'system';

        const updatedProvince = await this.provinceRepository.save(existingProvince);
        this.logger.log(`Province updated successfully: ${updatedProvince.id}`);

        return updatedProvince;
    }
}
