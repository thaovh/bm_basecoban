import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { GetServicesByGroupQuery } from '../get-services-by-group.query';
import { IServiceRepository, ServiceResponseDto } from '../../../domain/service.interface';

@QueryHandler(GetServicesByGroupQuery)
export class GetServicesByGroupHandler implements IQueryHandler<GetServicesByGroupQuery> {
    private readonly logger = new Logger(GetServicesByGroupHandler.name);

    constructor(
        @Inject('IServiceRepository')
        private readonly serviceRepository: IServiceRepository,
    ) { }

    async execute(query: GetServicesByGroupQuery): Promise<[ServiceResponseDto[], number]> {
        this.logger.log(`Executing GetServicesByGroupQuery for group id: ${query.serviceGroupId}`);

        const [services, total] = await this.serviceRepository.findByServiceGroup(
            query.serviceGroupId,
            query.limit,
            query.offset,
        );

        const serviceDtos: ServiceResponseDto[] = services.map((service) => ({
            id: service.id,
            serviceCode: service.serviceCode,
            serviceName: service.serviceName,
            shortName: service.shortName,
            serviceGroupId: service.serviceGroupId,
            unitOfMeasureId: service.unitOfMeasureId,
            mapping: service.mapping,
            numOrder: service.numOrder,
            currentPrice: service.currentPrice,
            parentServiceId: service.parentServiceId,
            isActiveFlag: service.isActiveFlag,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt,
            deletedAt: service.deletedAt,
            createdBy: service.createdBy,
            updatedBy: service.updatedBy,
            version: service.version,
            // Relationship objects
            serviceGroup: service.serviceGroup ? {
                id: service.serviceGroup.id,
                serviceGroupCode: service.serviceGroup.serviceGroupCode,
                serviceGroupName: service.serviceGroup.serviceGroupName,
                shortName: service.serviceGroup.shortName,
            } : undefined,
            unitOfMeasure: service.unitOfMeasure ? {
                id: service.unitOfMeasure.id,
                unitOfMeasureCode: service.unitOfMeasure.unitOfMeasureCode,
                unitOfMeasureName: service.unitOfMeasure.unitOfMeasureName,
            } : undefined,
            parentService: service.parentService ? {
                id: service.parentService.id,
                serviceCode: service.parentService.serviceCode,
                serviceName: service.parentService.serviceName,
                shortName: service.parentService.shortName,
            } : undefined,
        }));

        return [serviceDtos, total];
    }
}
