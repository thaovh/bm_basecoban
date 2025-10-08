import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { GetDepartmentByIdQuery } from '../get-department-by-id.query';
import { Department } from '../../../domain/department.entity';
import { IDepartmentRepository } from '../../../domain/department.interface';

export interface DepartmentResponseDto {
    id: string;
    departmentCode: string;
    departmentName: string;
    branchId: string;
    headOfDepartment?: string;
    headNurse?: string;
    parentDepartmentId?: string;
    shortName?: string;
    departmentTypeId: string;
    branch?: {
        id: string;
        branchCode: string;
        branchName: string;
    };
    departmentType?: {
        id: string;
        typeCode: string;
        typeName: string;
    };
    parentDepartment?: {
        id: string;
        departmentCode: string;
        departmentName: string;
    };
    subDepartments?: {
        id: string;
        departmentCode: string;
        departmentName: string;
    }[];
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
}

@QueryHandler(GetDepartmentByIdQuery)
export class GetDepartmentByIdHandler implements IQueryHandler<GetDepartmentByIdQuery> {
    private readonly logger = new Logger(GetDepartmentByIdHandler.name);

    constructor(
        @Inject('IDepartmentRepository')
        private readonly departmentRepository: IDepartmentRepository,
    ) { }

    async execute(query: GetDepartmentByIdQuery): Promise<DepartmentResponseDto> {
        const { id } = query;
        this.logger.log(`Getting department by ID: ${id}`);

        const department = await this.departmentRepository.findById(id);
        if (!department) {
            throw new NotFoundException('Department not found');
        }

        return {
            id: department.id,
            departmentCode: department.departmentCode,
            departmentName: department.departmentName,
            branchId: department.branchId,
            headOfDepartment: department.headOfDepartment,
            headNurse: department.headNurse,
            parentDepartmentId: department.parentDepartmentId,
            shortName: department.shortName,
            departmentTypeId: department.departmentTypeId,
            branch: department.branch ? {
                id: department.branch.id,
                branchCode: department.branch.branchCode,
                branchName: department.branch.branchName,
            } : undefined,
            departmentType: department.departmentType ? {
                id: department.departmentType.id,
                typeCode: department.departmentType.typeCode,
                typeName: department.departmentType.typeName,
            } : undefined,
            parentDepartment: department.parentDepartment ? {
                id: department.parentDepartment.id,
                departmentCode: department.parentDepartment.departmentCode,
                departmentName: department.parentDepartment.departmentName,
            } : undefined,
            subDepartments: department.subDepartments?.map(sub => ({
                id: sub.id,
                departmentCode: sub.departmentCode,
                departmentName: sub.departmentName,
            })),
            isActive: department.isActiveFlag,
            createdAt: department.createdAt,
            updatedAt: department.updatedAt,
        };
    }
}
