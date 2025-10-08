import {
    Entity,
    Column,
    Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('BMM_DEPARTMENT_TYPES')
@Unique('UK_DEPT_TYPE_CODE', ['typeCode'])
export class DepartmentType extends BaseEntity {

    @Column({ name: 'TYPE_CODE', type: 'varchar2', length: 20 })
    @ApiProperty({ description: 'Department type code', example: 'MED' })
    typeCode: string;

    @Column({ name: 'TYPE_NAME', type: 'varchar2', length: 200 })
    @ApiProperty({ description: 'Department type name', example: 'Khoa Nội' })
    typeName: string;

    @Column({ name: 'DESCRIPTION', type: 'varchar2', length: 500, nullable: true })
    @ApiProperty({ description: 'Department type description', example: 'Khoa điều trị nội khoa', required: false })
    description?: string;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is department type active', example: true })
    isActiveFlag: number;

    // Business methods
    isDepartmentTypeActive(): boolean {
        return this.isActiveFlag === 1 && super.isActive();
    }

    activate(): void {
        this.isActiveFlag = 1;
    }

    deactivate(): void {
        this.isActiveFlag = 0;
    }

    getDisplayName(): string {
        return `${this.typeCode} - ${this.typeName}`;
    }
}
