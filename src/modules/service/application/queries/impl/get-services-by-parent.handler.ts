import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { GetServicesByParentQuery } from '../get-services-by-parent.query';
import { IServiceRepository, ServiceResponseDto } from '../../../domain/service.interface';

@QueryHandler(GetServicesByParentQuery)
export class GetServicesByParentHandler implements IQueryHandler<GetServicesByParentQuery> {
    private readonly logger = new Logger(GetServicesByParentHandler.name);

    constructor(
        @Inject('IServiceRepository')
        private readonly serviceRepository: IServiceRepository,
    ) { }

    async execute(query: GetServicesByParentQuery): Promise<[ServiceResponseDto[], number]> {
        this.logger.log(`Executing GetServicesByParentQuery for parent id: ${query.parentServiceId}`);

        const [services, total] = await this.serviceRepository.findByParentService(
            query.parentServiceId,
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
