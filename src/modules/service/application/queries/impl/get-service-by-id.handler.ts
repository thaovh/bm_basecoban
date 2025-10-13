import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { GetServiceByIdQuery } from '../get-service-by-id.query';
import { IServiceRepository, ServiceResponseDto } from '../../../domain/service.interface';
import { AppError, HTTP_CLIENT_ERROR } from '../../../../../common/dtos/base-response.dto';

@QueryHandler(GetServiceByIdQuery)
export class GetServiceByIdHandler implements IQueryHandler<GetServiceByIdQuery> {
    private readonly logger = new Logger(GetServiceByIdHandler.name);

    constructor(
        @Inject('IServiceRepository')
        private readonly serviceRepository: IServiceRepository,
    ) { }

    async execute(query: GetServiceByIdQuery): Promise<ServiceResponseDto> {
        this.logger.log(`Executing GetServiceByIdQuery for id: ${query.id}`);

        const service = await this.serviceRepository.findById(query.id);

        if (!service) {
            throw new AppError('Service not found', 'SERVICE_NOT_FOUND', HTTP_CLIENT_ERROR.NOT_FOUND);
        }

        return {
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
            subServices: service.subServices?.map(sub => ({
                id: sub.id,
                serviceCode: sub.serviceCode,
                serviceName: sub.serviceName,
                shortName: sub.shortName,
                serviceGroupId: sub.serviceGroupId,
                unitOfMeasureId: sub.unitOfMeasureId,
                mapping: sub.mapping,
                numOrder: sub.numOrder,
                currentPrice: sub.currentPrice,
                parentServiceId: sub.parentServiceId,
                isActiveFlag: sub.isActiveFlag,
                createdAt: sub.createdAt,
                updatedAt: sub.updatedAt,
                deletedAt: sub.deletedAt,
                createdBy: sub.createdBy,
                updatedBy: sub.updatedBy,
                version: sub.version,
            })),
        };
    }
}
