import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Logger, Inject } from '@nestjs/common';
import { DeleteServiceTestCommand } from '../delete-service-test.command';
import { IServiceTestRepository } from '../../../domain/service-test.interface';
import { AppError, HTTP_CLIENT_ERROR } from '../../../../../common/dtos/base-response.dto';

@CommandHandler(DeleteServiceTestCommand)
export class DeleteServiceTestHandler implements ICommandHandler<DeleteServiceTestCommand> {
    private readonly logger = new Logger(DeleteServiceTestHandler.name);

    constructor(
        @Inject('IServiceTestRepository')
        private readonly serviceTestRepository: IServiceTestRepository,
    ) { }

    async execute(command: DeleteServiceTestCommand): Promise<void> {
        this.logger.log(`Handling DeleteServiceTestCommand for ID: ${command.id}`);

        try {
            // Check if service test exists
            const existingServiceTest = await this.serviceTestRepository.findById(command.id);
            if (!existingServiceTest) {
                throw new AppError(
                    'Service test not found',
                    'SERVICE_TEST_NOT_FOUND',
                    HTTP_CLIENT_ERROR.NOT_FOUND,
                );
            }

            // Soft delete the service test
            await this.serviceTestRepository.delete(command.id);
            this.logger.log(`Service test deleted successfully with ID: ${command.id}`);
        } catch (error) {
            this.logger.error(`Error deleting service test: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                'Failed to delete service test',
                'SERVICE_TEST_DELETE_ERROR',
                HTTP_CLIENT_ERROR.BAD_REQUEST,
            );
        }
    }
}
