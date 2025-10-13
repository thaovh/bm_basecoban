import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { GetServiceGroupsQuery } from '../get-service-groups.query';
import { IServiceGroupRepository, ServiceGroupResponseDto } from '../../../domain/service-group.interface';

@QueryHandler(GetServiceGroupsQuery)
export class GetServiceGroupsHandler implements IQueryHandler<GetServiceGroupsQuery> {
    private readonly logger = new Logger(GetServiceGroupsHandler.name);

    constructor(
        @Inject('IServiceGroupRepository')
        private readonly serviceGroupRepository: IServiceGroupRepository,
    ) { }

    async execute(query: GetServiceGroupsQuery): Promise<{
        serviceGroups: ServiceGroupResponseDto[];
        total: number;
        limit: number;
        offset: number;
    }> {
        const { getServiceGroupsDto } = query;
        const { limit = 10, offset = 0, search, isActive } = getServiceGroupsDto;

        this.logger.log(`Getting service groups - limit: ${limit}, offset: ${offset}, search: ${search}`);

        let serviceGroups: any[];
        let total: number;

        if (search) {
            // Search with filters
            [serviceGroups, total] = await this.serviceGroupRepository.findAndCount(limit, offset, search);
        } else if (isActive !== undefined) {
            // Filter by active status
            if (isActive) {
                [serviceGroups, total] = await this.serviceGroupRepository.findActiveServiceGroups(limit, offset);
            } else {
                [serviceGroups, total] = await this.serviceGroupRepository.findAndCount(limit, offset);
            }
        } else {
            // Get all
            [serviceGroups, total] = await this.serviceGroupRepository.findAndCount(limit, offset);
        }

        const serviceGroupResponseDtos: ServiceGroupResponseDto[] = serviceGroups.map(serviceGroup => ({
            id: serviceGroup.id,
            serviceGroupCode: serviceGroup.serviceGroupCode,
            serviceGroupName: serviceGroup.serviceGroupName,
            shortName: serviceGroup.shortName,
            mapping: serviceGroup.mapping,
            createdAt: serviceGroup.createdAt,
            updatedAt: serviceGroup.updatedAt,
            createdBy: serviceGroup.createdBy,
            updatedBy: serviceGroup.updatedBy,
            version: serviceGroup.version,
        }));

        return {
            serviceGroups: serviceGroupResponseDtos,
            total,
            limit,
            offset,
        };
    }
}
