import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { GetDepartmentTypeByIdQuery } from '../get-department-type-by-id.query';
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

@QueryHandler(GetDepartmentTypeByIdQuery)
export class GetDepartmentTypeByIdHandler implements IQueryHandler<GetDepartmentTypeByIdQuery> {
    private readonly logger = new Logger(GetDepartmentTypeByIdHandler.name);

    constructor(
        @Inject('IDepartmentTypeRepository')
        private readonly departmentTypeRepository: IDepartmentTypeRepository,
    ) { }

    async execute(query: GetDepartmentTypeByIdQuery): Promise<DepartmentTypeResponseDto> {
        const { id } = query;
        this.logger.log(`Getting department type by ID: ${id}`);

        const departmentType = await this.departmentTypeRepository.findById(id);
        if (!departmentType) {
            throw new NotFoundException('Department type not found');
        }

        return {
            id: departmentType.id,
            typeCode: departmentType.typeCode,
            typeName: departmentType.typeName,
            description: departmentType.description,
            isActive: departmentType.isActiveFlag,
            createdAt: departmentType.createdAt,
            updatedAt: departmentType.updatedAt,
        };
    }
}
