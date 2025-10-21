import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger, Inject } from '@nestjs/common';
import { GetServiceTestsQuery } from '../get-service-tests.query';
import { IServiceTestRepository, ServiceTestListResponseDto, ServiceTestResponseDto } from '../../../domain/service-test.interface';

@QueryHandler(GetServiceTestsQuery)
export class GetServiceTestsHandler implements IQueryHandler<GetServiceTestsQuery> {
    private readonly logger = new Logger(GetServiceTestsHandler.name);

    constructor(
        @Inject('IServiceTestRepository')
        private readonly serviceTestRepository: IServiceTestRepository,
    ) { }

    async execute(query: GetServiceTestsQuery): Promise<ServiceTestListResponseDto> {
        this.logger.log(`Handling GetServiceTestsQuery with params: ${JSON.stringify(query.params)}`);

        try {
            const { limit = 10, offset = 0 } = query.params;
            const [serviceTests, total] = await this.serviceTestRepository.findActiveServiceTests(limit, offset);

            const serviceTestDtos: ServiceTestResponseDto[] = serviceTests.map(serviceTest => ({
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
            }));

            return {
                serviceTests: serviceTestDtos,
                total,
                limit,
                offset,
            };
        } catch (error) {
            this.logger.error(`Error getting service tests: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
    }
}
