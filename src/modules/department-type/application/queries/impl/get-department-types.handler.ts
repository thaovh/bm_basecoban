import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { GetDepartmentTypesQuery } from '../get-department-types.query';
import { DepartmentType } from '../../../domain/department-type.entity';
import { IDepartmentTypeRepository } from '../../../domain/department-type.interface';

export interface DepartmentTypeResponseDto {
    id: string;
    typeCode: string;
    typeName: string;
    description?: string;
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetDepartmentTypesResult {
    items: DepartmentTypeResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

@QueryHandler(GetDepartmentTypesQuery)
export class GetDepartmentTypesHandler implements IQueryHandler<GetDepartmentTypesQuery> {
    private readonly logger = new Logger(GetDepartmentTypesHandler.name);

    constructor(
        @Inject('IDepartmentTypeRepository')
        private readonly departmentTypeRepository: IDepartmentTypeRepository,
    ) { }

    async execute(query: GetDepartmentTypesQuery): Promise<GetDepartmentTypesResult> {
        const { getDepartmentTypesDto } = query;
        const { search, isActive, limit = 10, offset = 0 } = getDepartmentTypesDto;

        this.logger.log(`Getting department types with filters: search=${search}, isActive=${isActive}`);

        let departmentTypes: DepartmentType[];
        let total: number;

        if (search) {
            // Search department types by name or code
            [departmentTypes, total] = await this.departmentTypeRepository.searchDepartmentTypes(search, limit, offset);
        } else if (isActive !== undefined) {
            // Filter by active status
            if (isActive) {
                [departmentTypes, total] = await this.departmentTypeRepository.findActiveDepartmentTypes(limit, offset);
            } else {
                [departmentTypes, total] = await this.departmentTypeRepository.findAllDepartmentTypes(limit, offset);
            }
        } else {
            // Get all department types
            [departmentTypes, total] = await this.departmentTypeRepository.findAllDepartmentTypes(limit, offset);
        }

        const items: DepartmentTypeResponseDto[] = departmentTypes.map(departmentType => ({
            id: departmentType.id,
            typeCode: departmentType.typeCode,
            typeName: departmentType.typeName,
            description: departmentType.description,
            isActive: departmentType.isActiveFlag,
            createdAt: departmentType.createdAt,
            updatedAt: departmentType.updatedAt,
        }));

        return {
            items,
            total,
            limit,
            offset,
        };
    }
}
