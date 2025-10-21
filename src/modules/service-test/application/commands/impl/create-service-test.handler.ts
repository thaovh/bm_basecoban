import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Logger, Inject } from '@nestjs/common';
import { CreateServiceTestCommand } from '../create-service-test.command';
import { ServiceTest } from '../../../domain/service-test.entity';
import { IServiceTestRepository } from '../../../domain/service-test.interface';
import { AppError, HTTP_CLIENT_ERROR } from '../../../../../common/dtos/base-response.dto';

@CommandHandler(CreateServiceTestCommand)
export class CreateServiceTestHandler implements ICommandHandler<CreateServiceTestCommand> {
    private readonly logger = new Logger(CreateServiceTestHandler.name);

    constructor(
        @Inject('IServiceTestRepository')
        private readonly serviceTestRepository: IServiceTestRepository,
    ) { }

    async execute(command: CreateServiceTestCommand): Promise<ServiceTest> {
        this.logger.log(`Handling CreateServiceTestCommand for test code: ${command.createServiceTestDto.testCode}`);

        try {
            // Check if test code already exists
            const existingTest = await this.serviceTestRepository.findByCode(command.createServiceTestDto.testCode);
            if (existingTest) {
                throw new AppError(
                    'Service test code already exists',
                    'SERVICE_TEST_CODE_CONFLICT',
                    HTTP_CLIENT_ERROR.CONFLICT,
                );
            }

            // Create new service test
            const serviceTest = new ServiceTest();
            serviceTest.testCode = command.createServiceTestDto.testCode;
            serviceTest.testName = command.createServiceTestDto.testName;
            serviceTest.shortName = command.createServiceTestDto.shortName;
            serviceTest.serviceId = command.createServiceTestDto.serviceId;
            serviceTest.unitOfMeasureId = command.createServiceTestDto.unitOfMeasureId;
            serviceTest.rangeText = command.createServiceTestDto.rangeText;
            serviceTest.rangeLow = command.createServiceTestDto.rangeLow;
            serviceTest.rangeHigh = command.createServiceTestDto.rangeHigh;
            serviceTest.mapping = command.createServiceTestDto.mapping;
            serviceTest.testOrder = command.createServiceTestDto.testOrder || 0;
            serviceTest.isActiveFlag = command.createServiceTestDto.isActiveFlag || 1;

            const savedServiceTest = await this.serviceTestRepository.save(serviceTest);
            this.logger.log(`Service test created successfully with ID: ${savedServiceTest.id}`);

            return savedServiceTest;
        } catch (error) {
            this.logger.error(`Error creating service test: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                'Failed to create service test',
                'SERVICE_TEST_CREATION_ERROR',
                HTTP_CLIENT_ERROR.BAD_REQUEST,
            );
        }
    }
}
