import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Branch } from '../../branch/domain/branch.entity';
import { DepartmentType } from '../../department-type/domain/department-type.entity';

@Entity('BMM_DEPARTMENTS')
@Unique('UK_DEPT_CODE', ['departmentCode'])
export class Department extends BaseEntity {

    @Column({ name: 'DEPARTMENT_CODE', type: 'varchar2', length: 20 })
    @ApiProperty({ description: 'Department code', example: 'MED001' })
    departmentCode: string;

    @Column({ name: 'DEPARTMENT_NAME', type: 'varchar2', length: 200 })
    @ApiProperty({ description: 'Department name', example: 'Khoa Tim Mạch' })
    departmentName: string;

    @Column({ name: 'BRANCH_ID', type: 'varchar2', length: 36 })
    @ApiProperty({ description: 'Branch ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525' })
    branchId: string;

    @Column({ name: 'HEAD_OF_DEPARTMENT', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'Head of department', example: 'BS. Nguyễn Văn A', required: false })
    headOfDepartment?: string;

    @Column({ name: 'HEAD_NURSE', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'Head nurse', example: 'ĐD. Trần Thị B', required: false })
    headNurse?: string;

    @Column({ name: 'PARENT_DEPARTMENT_ID', type: 'varchar2', length: 36, nullable: true })
    @ApiProperty({ description: 'Parent department ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525', required: false })
    parentDepartmentId?: string;

    @Column({ name: 'SHORT_NAME', type: 'varchar2', length: 50, nullable: true })
    @ApiProperty({ description: 'Department short name', example: 'TM', required: false })
    shortName?: string;

    @Column({ name: 'DEPARTMENT_TYPE_ID', type: 'varchar2', length: 36 })
    @ApiProperty({ description: 'Department type ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525' })
    departmentTypeId: string;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is department active', example: true })
    isActiveFlag: number;

    // Relationships
    @ManyToOne(() => Branch)
    @JoinColumn({ name: 'BRANCH_ID', foreignKeyConstraintName: 'FK_DEPT_BRANCH' })
    branch?: Branch;

    @ManyToOne(() => DepartmentType)
    @JoinColumn({ name: 'DEPARTMENT_TYPE_ID', foreignKeyConstraintName: 'FK_DEPT_TYPE' })
    departmentType?: DepartmentType;

    @ManyToOne(() => Department, department => department.subDepartments)
    @JoinColumn({ name: 'PARENT_DEPARTMENT_ID', foreignKeyConstraintName: 'FK_DEPT_PARENT' })
    parentDepartment?: Department;

    @OneToMany(() => Department, department => department.parentDepartment)
    subDepartments?: Department[];

    // Business methods
    isDepartmentActive(): boolean {
        return this.isActiveFlag === 1 && super.isActive();
    }

    activate(): void {
        this.isActiveFlag = 1;
    }

    deactivate(): void {
        this.isActiveFlag = 0;
    }

    getDisplayName(): string {
        return `${this.departmentCode} - ${this.departmentName}`;
    }

    isSubDepartment(): boolean {
        return this.parentDepartmentId !== null && this.parentDepartmentId !== undefined;
    }

    isParentDepartment(): boolean {
        return this.subDepartments && this.subDepartments.length > 0;
    }

    getFullHierarchy(): string {
        const parts = [this.departmentName];
        if (this.branch?.branchName) {
            parts.push(`(${this.branch.branchName})`);
        }
        return parts.join(' ');
    }
}
