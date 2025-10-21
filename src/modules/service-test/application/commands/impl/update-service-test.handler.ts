import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Logger, Inject } from '@nestjs/common';
import { UpdateServiceTestCommand } from '../update-service-test.command';
import { ServiceTest } from '../../../domain/service-test.entity';
import { IServiceTestRepository } from '../../../domain/service-test.interface';
import { AppError, HTTP_CLIENT_ERROR } from '../../../../../common/dtos/base-response.dto';

@CommandHandler(UpdateServiceTestCommand)
export class UpdateServiceTestHandler implements ICommandHandler<UpdateServiceTestCommand> {
    private readonly logger = new Logger(UpdateServiceTestHandler.name);

    constructor(
        @Inject('IServiceTestRepository')
        private readonly serviceTestRepository: IServiceTestRepository,
    ) { }

    async execute(command: UpdateServiceTestCommand): Promise<ServiceTest> {
        this.logger.log(`Handling UpdateServiceTestCommand for ID: ${command.id}`);

        try {
            // Find existing service test
            const existingServiceTest = await this.serviceTestRepository.findById(command.id);
            if (!existingServiceTest) {
                throw new AppError(
                    'Service test not found',
                    'SERVICE_TEST_NOT_FOUND',
                    HTTP_CLIENT_ERROR.NOT_FOUND,
                );
            }

            // Update fields if provided
            if (command.updateServiceTestDto.testName !== undefined) {
                existingServiceTest.testName = command.updateServiceTestDto.testName;
            }
            if (command.updateServiceTestDto.shortName !== undefined) {
                existingServiceTest.shortName = command.updateServiceTestDto.shortName;
            }
            if (command.updateServiceTestDto.serviceId !== undefined) {
                existingServiceTest.serviceId = command.updateServiceTestDto.serviceId;
            }
            if (command.updateServiceTestDto.unitOfMeasureId !== undefined) {
                existingServiceTest.unitOfMeasureId = command.updateServiceTestDto.unitOfMeasureId;
            }
            if (command.updateServiceTestDto.rangeText !== undefined) {
                existingServiceTest.rangeText = command.updateServiceTestDto.rangeText;
            }
            if (command.updateServiceTestDto.rangeLow !== undefined) {
                existingServiceTest.rangeLow = command.updateServiceTestDto.rangeLow;
            }
            if (command.updateServiceTestDto.rangeHigh !== undefined) {
                existingServiceTest.rangeHigh = command.updateServiceTestDto.rangeHigh;
            }
            if (command.updateServiceTestDto.mapping !== undefined) {
                existingServiceTest.mapping = command.updateServiceTestDto.mapping;
            }
            if (command.updateServiceTestDto.testOrder !== undefined) {
                existingServiceTest.testOrder = command.updateServiceTestDto.testOrder;
            }
            if (command.updateServiceTestDto.isActiveFlag !== undefined) {
                existingServiceTest.isActiveFlag = command.updateServiceTestDto.isActiveFlag;
            }

            const updatedServiceTest = await this.serviceTestRepository.save(existingServiceTest);
            this.logger.log(`Service test updated successfully with ID: ${updatedServiceTest.id}`);

            return updatedServiceTest;
        } catch (error) {
            this.logger.error(`Error updating service test: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                'Failed to update service test',
                'SERVICE_TEST_UPDATE_ERROR',
                HTTP_CLIENT_ERROR.BAD_REQUEST,
            );
        }
    }
}
