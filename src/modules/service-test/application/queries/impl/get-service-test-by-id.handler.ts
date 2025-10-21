import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger, Inject } from '@nestjs/common';
import { GetServiceTestByIdQuery } from '../get-service-test-by-id.query';
import { IServiceTestRepository, ServiceTestResponseDto } from '../../../domain/service-test.interface';
import { AppError, HTTP_CLIENT_ERROR } from '../../../../../common/dtos/base-response.dto';

@QueryHandler(GetServiceTestByIdQuery)
export class GetServiceTestByIdHandler implements IQueryHandler<GetServiceTestByIdQuery> {
    private readonly logger = new Logger(GetServiceTestByIdHandler.name);

    constructor(
        @Inject('IServiceTestRepository')
        private readonly serviceTestRepository: IServiceTestRepository,
    ) { }

    async execute(query: GetServiceTestByIdQuery): Promise<ServiceTestResponseDto> {
        this.logger.log(`Handling GetServiceTestByIdQuery for ID: ${query.id}`);

        try {
            const serviceTest = await this.serviceTestRepository.findById(query.id);
            if (!serviceTest) {
                throw new AppError(
                    'Service test not found',
                    'SERVICE_TEST_NOT_FOUND',
                    HTTP_CLIENT_ERROR.NOT_FOUND,
                );
            }

            const serviceTestDto: ServiceTestResponseDto = {
                id: serviceTest.id,
                testCode: serviceTest.testCode,
                testName: serviceTest.testName,
                shortName: serviceTest.shortName,
                serviceId: serviceTest.serviceId,
                serviceName: serviceTest.service?.serviceName,
                serviceCode: serviceTest.service?.serviceCode,
                unitOfMeasureId: serviceTest.unitOfMeasureId,
                unitOfMeasureName: serviceTest.unitOfMeasure?.unitOfMeasureName,
                rangeText: serviceTest.rangeText,
                rangeLow: serviceTest.rangeLow,
                rangeHigh: serviceTest.rangeHigh,
                mapping: serviceTest.mapping,
                testOrder: serviceTest.testOrder,
                isActiveFlag: serviceTest.isActiveFlag,
                createdAt: serviceTest.createdAt,
                updatedAt: serviceTest.updatedAt,
            };

            return serviceTestDto;
        } catch (error) {
            this.logger.error(`Error getting service test by ID: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                'Failed to retrieve service test',
                'SERVICE_TEST_RETRIEVAL_ERROR',
                HTTP_CLIENT_ERROR.BAD_REQUEST,
            );
        }
    }
}
