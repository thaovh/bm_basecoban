import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { DeleteProvinceCommand } from '../delete-province.command';
import { IProvinceRepository } from '../../../domain/province.interface';

@CommandHandler(DeleteProvinceCommand)
export class DeleteProvinceHandler implements ICommandHandler<DeleteProvinceCommand> {
    private readonly logger = new Logger(DeleteProvinceHandler.name);

    constructor(
        @Inject('IProvinceRepository')
        private readonly provinceRepository: IProvinceRepository,
    ) { }

    async execute(command: DeleteProvinceCommand): Promise<void> {
        const { id } = command;
        this.logger.log(`Deleting province: ${id}`);

        // Check if province exists
        const existingProvince = await this.provinceRepository.findById(id);
        if (!existingProvince) {
            throw new NotFoundException('Province not found');
        }

        // Soft delete the province
        await this.provinceRepository.delete(id);
        this.logger.log(`Province deleted successfully: ${id}`);
    }
}
