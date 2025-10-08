import {
    Entity,
    Column,
    Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

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

    @Column({ name: 'FIRST_NAME', type: 'varchar2', length: 50 })
    @ApiProperty({ description: 'First name', example: 'John' })
    firstName: string;

    @Column({ name: 'LAST_NAME', type: 'varchar2', length: 50 })
    @ApiProperty({ description: 'Last name', example: 'Doe' })
    lastName: string;

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


    // Business methods
    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
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
}
