import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, ConflictException } from '@nestjs/common';

import { CreateProvinceCommand } from '../create-province.command';
import { Province } from '../../../domain/province.entity';
import { IProvinceRepository } from '../../../domain/province.interface';
import { AppError } from '../../../../../common/dtos/base-response.dto';

@CommandHandler(CreateProvinceCommand)
export class CreateProvinceHandler implements ICommandHandler<CreateProvinceCommand> {
    private readonly logger = new Logger(CreateProvinceHandler.name);

    constructor(
        @Inject('IProvinceRepository')
        private readonly provinceRepository: IProvinceRepository,
    ) { }

    async execute(command: CreateProvinceCommand): Promise<Province> {
        const { createProvinceDto } = command;
        this.logger.log(`Creating province: ${createProvinceDto.provinceName}`);

        // Check if province code already exists
        const existingByCode = await this.provinceRepository.findByCode(createProvinceDto.provinceCode);
        if (existingByCode) {
            throw new ConflictException('Province code already exists');
        }

        // Check if province name already exists
        const existingByName = await this.provinceRepository.findByName(createProvinceDto.provinceName);
        if (existingByName) {
            throw new ConflictException('Province name already exists');
        }

        // Create new province
        const province = new Province();
        province.provinceCode = createProvinceDto.provinceCode;
        province.provinceName = createProvinceDto.provinceName;
        province.isActive = createProvinceDto.isActive ? 1 : 1; // Default to active
        province.createdBy = 'system';

        const savedProvince = await this.provinceRepository.save(province);
        this.logger.log(`Province created successfully: ${savedProvince.id}`);

        return savedProvince;
    }
}
