import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { GetServiceGroupByIdQuery } from '../get-service-group-by-id.query';
import { IServiceGroupRepository } from '../../../domain/service-group.interface';
import { AppError } from '../../../../../common/dtos/base-response.dto';

@QueryHandler(GetServiceGroupByIdQuery)
export class GetServiceGroupByIdHandler implements IQueryHandler<GetServiceGroupByIdQuery> {
    private readonly logger = new Logger(GetServiceGroupByIdHandler.name);

    constructor(
        @Inject('IServiceGroupRepository')
        private readonly serviceGroupRepository: IServiceGroupRepository,
    ) { }

    async execute(query: GetServiceGroupByIdQuery) {
        const { id } = query;
        this.logger.log(`Getting service group by id: ${id}`);

        const serviceGroup = await this.serviceGroupRepository.findById(id);
        if (!serviceGroup) {
            throw new AppError('BIZ_001', 'Service group not found', 404);
        }

        return {
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
        };
    }
}
