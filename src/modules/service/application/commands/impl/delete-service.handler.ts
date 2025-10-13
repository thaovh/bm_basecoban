import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { DeleteServiceCommand } from '../delete-service.command';
import { IServiceRepository } from '../../../domain/service.interface';
import { AppError, HTTP_CLIENT_ERROR } from '../../../../../common/dtos/base-response.dto';

@CommandHandler(DeleteServiceCommand)
export class DeleteServiceHandler implements ICommandHandler<DeleteServiceCommand> {
    private readonly logger = new Logger(DeleteServiceHandler.name);

    constructor(
        @Inject('IServiceRepository')
        private readonly serviceRepository: IServiceRepository,
    ) { }

    async execute(command: DeleteServiceCommand): Promise<void> {
        this.logger.log(`Executing DeleteServiceCommand for id: ${command.id}`);

        const service = await this.serviceRepository.findById(command.id);

        if (!service) {
            throw new AppError('Service not found', 'SERVICE_NOT_FOUND', HTTP_CLIENT_ERROR.NOT_FOUND);
        }

        await this.serviceRepository.delete(command.id);
    }
}
