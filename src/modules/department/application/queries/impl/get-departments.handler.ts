import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { GetDepartmentsQuery } from '../get-departments.query';
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

export interface GetDepartmentsResult {
    items: DepartmentResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

@QueryHandler(GetDepartmentsQuery)
export class GetDepartmentsHandler implements IQueryHandler<GetDepartmentsQuery> {
    private readonly logger = new Logger(GetDepartmentsHandler.name);

    constructor(
        @Inject('IDepartmentRepository')
        private readonly departmentRepository: IDepartmentRepository,
    ) { }

    async execute(query: GetDepartmentsQuery): Promise<GetDepartmentsResult> {
        const { getDepartmentsDto } = query;
        const {
            search,
            branchId,
            departmentTypeId,
            parentDepartmentId,
            isActive,
            parentOnly,
            subOnly,
            limit = 10,
            offset = 0
        } = getDepartmentsDto;

        this.logger.log(`Getting departments with filters: search=${search}, branchId=${branchId}, departmentTypeId=${departmentTypeId}, parentDepartmentId=${parentDepartmentId}, isActive=${isActive}, parentOnly=${parentOnly}, subOnly=${subOnly}`);

        let departments: Department[];
        let total: number;

        if (search) {
            // Search departments by name or code
            [departments, total] = await this.departmentRepository.searchDepartments(search, limit, offset);
        } else if (branchId) {
            // Get departments by branch
            [departments, total] = await this.departmentRepository.findDepartmentsByBranch(branchId, limit, offset);
        } else if (departmentTypeId) {
            // Get departments by type
            [departments, total] = await this.departmentRepository.findDepartmentsByType(departmentTypeId, limit, offset);
        } else if (parentDepartmentId) {
            // Get sub departments by parent
            [departments, total] = await this.departmentRepository.findSubDepartments(parentDepartmentId, limit, offset);
        } else if (parentOnly) {
            // Get only parent departments
            [departments, total] = await this.departmentRepository.findParentDepartments(limit, offset);
        } else if (subOnly) {
            // Get only sub departments (has parent)
            [departments, total] = await this.departmentRepository.findAllDepartments(limit, offset);
            departments = departments.filter(dept => dept.parentDepartmentId);
            total = departments.length;
        } else if (isActive !== undefined) {
            // Filter by active status
            if (isActive) {
                [departments, total] = await this.departmentRepository.findActiveDepartments(limit, offset);
            } else {
                [departments, total] = await this.departmentRepository.findAllDepartments(limit, offset);
            }
        } else {
            // Get all departments
            [departments, total] = await this.departmentRepository.findAllDepartments(limit, offset);
        }

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
