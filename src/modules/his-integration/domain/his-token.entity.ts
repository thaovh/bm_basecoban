import {
    Entity,
    Column,
    Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('BMM_HIS_TOKENS')
@Unique('UK_HIS_TOKEN_CODE', ['tokenCode'])
export class HisToken extends BaseEntity {

    @Column({ name: 'TOKEN_CODE', type: 'varchar2', length: 100 })
    @ApiProperty({ description: 'HIS Token Code', example: 'a4dbb5c62008a8e781bb0045fe3ae7c2af9d0f4e98261e9aa5daa8d1be56848c' })
    tokenCode: string;

    @Column({ name: 'RENEW_CODE', type: 'varchar2', length: 200 })
    @ApiProperty({ description: 'HIS Renew Code', example: 'b5168582075d948ddad0c646b652e44b033e7bf6c9eec5a0e115cde63f910f22b5168582075d948ddad0c646b652e44b033e7bf6c9eec5a0e115cde63f910f22' })
    renewCode: string;

    @Column({ name: 'LOGIN_TIME', type: 'timestamp' })
    @ApiProperty({ description: 'Login time', example: '2025-10-08T19:30:31.4900668+07:00' })
    loginTime: Date;

    @Column({ name: 'EXPIRE_TIME', type: 'timestamp' })
    @ApiProperty({ description: 'Token expire time', example: '2025-11-07T19:30:31.4900668+07:00' })
    expireTime: Date;

    @Column({ name: 'LOGIN_ADDRESS', type: 'varchar2', length: 50 })
    @ApiProperty({ description: 'Login IP address', example: '192.168.68.209' })
    loginAddress: string;

    @Column({ name: 'USER_LOGIN_NAME', type: 'varchar2', length: 50 })
    @ApiProperty({ description: 'User login name', example: 'vht2' })
    userLoginName: string;

    @Column({ name: 'USER_NAME', type: 'varchar2', length: 100 })
    @ApiProperty({ description: 'User full name', example: 'VŨ HOÀNG THAO' })
    userName: string;

    @Column({ name: 'USER_EMAIL', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'User email', example: 'vht2@bachmai.edu.vn', required: false })
    userEmail?: string;

    @Column({ name: 'USER_MOBILE', type: 'varchar2', length: 20, nullable: true })
    @ApiProperty({ description: 'User mobile', example: '0936226839', required: false })
    userMobile?: string;

    @Column({ name: 'USER_G_CODE', type: 'varchar2', length: 20 })
    @ApiProperty({ description: 'User G Code', example: '0000000001' })
    userGCode: string;

    @Column({ name: 'APPLICATION_CODE', type: 'varchar2', length: 20 })
    @ApiProperty({ description: 'Application code', example: 'HIS' })
    applicationCode: string;

    @Column({ name: 'ROLE_DATAS', type: 'clob', nullable: true })
    @ApiProperty({ description: 'Role data in JSON format', required: false })
    roleDatas?: string;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is token active', example: true })
    isActiveFlag: number;

    // Business methods
    isTokenActive(): boolean {
        return this.isActiveFlag === 1 && super.isActive();
    }

    isTokenExpired(): boolean {
        return new Date() >= this.expireTime;
    }

    isTokenExpiringSoon(minutesBeforeExpire: number = 5): boolean {
        const threshold = new Date();
        threshold.setMinutes(threshold.getMinutes() + minutesBeforeExpire);
        return threshold >= this.expireTime;
    }

    getTimeUntilExpire(): number {
        return this.expireTime.getTime() - new Date().getTime();
    }

    getMinutesUntilExpire(): number {
        return Math.floor(this.getTimeUntilExpire() / (1000 * 60));
    }

    activate(): void {
        this.isActiveFlag = 1;
        this.deletedAt = undefined;
    }

    deactivate(): void {
        this.isActiveFlag = 0;
        this.softDelete();
    }

    updateTokenData(tokenCode: string, renewCode: string, expireTime: Date): void {
        this.tokenCode = tokenCode;
        this.renewCode = renewCode;
        this.expireTime = expireTime;
        this.updatedAt = new Date();
    }

    parseRoleDatas(): any[] {
        try {
            return this.roleDatas ? JSON.parse(this.roleDatas) : [];
        } catch (error) {
            return [];
        }
    }

    hasRole(roleCode: string): boolean {
        const roles = this.parseRoleDatas();
        return roles.some(role => role.RoleCode === roleCode);
    }

    getRoleNames(): string[] {
        const roles = this.parseRoleDatas();
        return roles.map(role => role.RoleName);
    }
}
