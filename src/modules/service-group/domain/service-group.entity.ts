import { Entity, Column, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('BMM_SERVICE_GROUPS')
@Index('IDX_BMM_SERVICE_GROUPS_CODE', ['serviceGroupCode'])
@Index('IDX_BMM_SERVICE_GROUPS_NAME', ['serviceGroupName'])
@Index('IDX_BMM_SERVICE_GROUPS_SHORT_NAME', ['shortName'])
export class ServiceGroup extends BaseEntity {
    @Column({ name: 'SERVICE_GROUP_CODE', type: 'varchar2', length: 50, unique: true })
    @ApiProperty({
        description: 'Service group code (unique identifier)',
        example: 'LAB_001',
        maxLength: 50
    })
    serviceGroupCode: string;

    @Column({ name: 'SERVICE_GROUP_NAME', type: 'varchar2', length: 200 })
    @ApiProperty({
        description: 'Service group name',
        example: 'Laboratory Services',
        maxLength: 200
    })
    serviceGroupName: string;

    @Column({ name: 'SHORT_NAME', type: 'varchar2', length: 50 })
    @ApiProperty({
        description: 'Short name for service group',
        example: 'LAB',
        maxLength: 50
    })
    shortName: string;

    @Column({ name: 'MAPPING', type: 'varchar2', length: 500, nullable: true })
    @ApiProperty({
        description: 'Mapping information (JSON string or text mapping)',
        example: '{"hisCode": "LAB001", "externalSystem": "LIS"}',
        maxLength: 500,
        required: false
    })
    mapping?: string;

    // Business methods
    getDisplayName(): string {
        return `${this.serviceGroupCode} - ${this.serviceGroupName}`;
    }

    getShortDisplayName(): string {
        return `${this.shortName} - ${this.serviceGroupName}`;
    }

    hasMapping(): boolean {
        return this.mapping && this.mapping.trim().length > 0;
    }
}
