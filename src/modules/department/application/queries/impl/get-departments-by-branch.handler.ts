import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { GetDepartmentsByBranchQuery } from '../get-departments-by-branch.query';
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
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetDepartmentsByBranchResult {
    items: DepartmentResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

@QueryHandler(GetDepartmentsByBranchQuery)
export class GetDepartmentsByBranchHandler implements IQueryHandler<GetDepartmentsByBranchQuery> {
    private readonly logger = new Logger(GetDepartmentsByBranchHandler.name);

    constructor(
        @Inject('IDepartmentRepository')
        private readonly departmentRepository: IDepartmentRepository,
    ) { }

    async execute(query: GetDepartmentsByBranchQuery): Promise<GetDepartmentsByBranchResult> {
        const { branchId, limit, offset } = query;
        this.logger.log(`Getting departments by branch: ${branchId}`);

        const [departments, total] = await this.departmentRepository.findDepartmentsByBranch(branchId, limit, offset);

        const items: DepartmentResponseDto[] = departments.map(department => ({
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
            isActive: department.isActiveFlag,
            createdAt: department.createdAt,
            updatedAt: department.updatedAt,
        }));

        return {
            items,
            total,
            limit,
            offset,
        };
    }
}
