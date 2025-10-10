import {
    Entity,
    Column,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Province } from '../../province/domain/province.entity';
import { Ward } from '../../ward/domain/ward.entity';
import { Department } from '../../department/domain/department.entity';

@Entity('BMM_USERS')
@Index('IDX_BMM_USERS_IS_ACTIVE', ['isActiveFlag'])
@Index('IDX_BMM_USERS_CREATED_AT', ['createdAt'])
export class User extends BaseEntity {

    @Column({ name: 'USERNAME', type: 'varchar2', length: 50, unique: true })
    @ApiProperty({ description: 'Username', example: 'john_doe' })
    username: string;

    @Column({ name: 'EMAIL', type: 'varchar2', length: 100, unique: true })
    @ApiProperty({ description: 'Email address', example: 'john.doe@example.com' })
    email: string;

    @Column({ name: 'PASSWORD_HASH', type: 'varchar2', length: 255 })
    passwordHash: string;

    @Column({ name: 'FULL_NAME', type: 'varchar2', length: 100 })
    @ApiProperty({ description: 'Full name', example: 'John Doe' })
    fullName: string;

    @Column({ name: 'PHONE_NUMBER', type: 'varchar2', length: 20, nullable: true })
    @ApiProperty({ description: 'Phone number', example: '+84901234567', required: false })
    phoneNumber?: string;

    @Column({ name: 'DATE_OF_BIRTH', type: 'date', nullable: true })
    @ApiProperty({ description: 'Date of birth', example: '1990-01-15', required: false })
    dateOfBirth?: Date;

    @Column({ name: 'ADDRESS', type: 'clob', nullable: true })
    @ApiProperty({ description: 'Address', example: '123 Main St, Ho Chi Minh City', required: false })
    address?: string;

    @Column({ name: 'ROLE', type: 'varchar2', length: 20, default: 'user' })
    @ApiProperty({ description: 'User role', example: 'user', enum: ['admin', 'user'] })
    role: 'admin' | 'user';

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is user active', example: true })
    isActiveFlag: number;

    @Column({ name: 'LAST_LOGIN_AT', type: 'timestamp', nullable: true })
    @ApiProperty({ description: 'Last login timestamp', example: '2024-01-15T10:30:00Z', required: false })
    lastLoginAt?: Date;

    @Column({ name: 'HIS_USERNAME', type: 'varchar2', length: 50, nullable: true })
    @ApiProperty({ description: 'HIS username for integration', example: 'vht2', required: false })
    hisUsername?: string;

    @Column({ name: 'HIS_PASSWORD', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'HIS password for integration', example: 't123456', required: false })
    hisPassword?: string;

    @Column({ name: 'PROVINCE_ID', type: 'varchar2', length: 36, nullable: true })
    @ApiProperty({ description: 'Province ID', example: 'uuid-province-id', required: false })
    provinceId?: string;

    @Column({ name: 'WARD_ID', type: 'varchar2', length: 36, nullable: true })
    @ApiProperty({ description: 'Ward ID', example: 'uuid-ward-id', required: false })
    wardId?: string;

    @Column({ name: 'DEPARTMENT_ID', type: 'varchar2', length: 36, nullable: true })
    @ApiProperty({ description: 'Department ID', example: 'uuid-department-id', required: false })
    departmentId?: string;

    // Relationships
    @ManyToOne(() => Province, { nullable: true })
    @JoinColumn({ name: 'PROVINCE_ID', foreignKeyConstraintName: 'FK_USER_PROVINCE' })
    province?: Province;

    @ManyToOne(() => Ward, { nullable: true })
    @JoinColumn({ name: 'WARD_ID', foreignKeyConstraintName: 'FK_USER_WARD' })
    ward?: Ward;

    @ManyToOne(() => Department, { nullable: true })
    @JoinColumn({ name: 'DEPARTMENT_ID', foreignKeyConstraintName: 'FK_USER_DEPARTMENT' })
    department?: Department;

    // Business methods
    getFullName(): string {
        return this.fullName;
    }

    isAccountActive(): boolean {
        return this.isActiveFlag === 1 && super.isActive();
    }

    isAdmin(): boolean {
        return this.role === 'admin';
    }

    updateLastLogin(): void {
        this.lastLoginAt = new Date();
    }

    hasHisCredentials(): boolean {
        return !!(this.hisUsername && this.hisPassword);
    }

    getHisCredentials(): { username: string; password: string } | null {
        if (this.hasHisCredentials()) {
            return {
                username: this.hisUsername!,
                password: this.hisPassword!
            };
        }
        return null;
    }
}
