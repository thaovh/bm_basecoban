import { Entity, Column, Unique, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ServiceGroup } from '../../service-group/domain/service-group.entity';
import { UnitOfMeasure } from '../../unit-of-measure/domain/unit-of-measure.entity';
import { ServicePriceHistory } from './service-price-history.entity';

@Entity('BMM_SERVICES')
@Unique('UK_SERVICE_CODE', ['serviceCode'])
export class Service extends BaseEntity {
    @Column({ name: 'SERVICE_CODE', type: 'varchar2', length: 50 })
    @ApiProperty({
        description: 'Mã dịch vụ (unique identifier)',
        example: 'LAB_001',
        maxLength: 50
    })
    serviceCode: string;

    @Column({ name: 'SERVICE_NAME', type: 'varchar2', length: 200 })
    @ApiProperty({
        description: 'Tên dịch vụ',
        example: 'Xét nghiệm máu tổng quát',
        maxLength: 200
    })
    serviceName: string;

    @Column({ name: 'SHORT_NAME', type: 'varchar2', length: 50 })
    @ApiProperty({
        description: 'Tên viết tắt',
        example: 'XN Máu TQ',
        maxLength: 50
    })
    shortName: string;

    @Column({ name: 'SERVICE_GROUP_ID', type: 'varchar2', length: 36 })
    @ApiProperty({
        description: 'ID nhóm dịch vụ',
        example: 'uuid-service-group-id'
    })
    serviceGroupId: string;

    @Column({ name: 'UNIT_OF_MEASURE_ID', type: 'varchar2', length: 36 })
    @ApiProperty({
        description: 'ID đơn vị tính',
        example: 'uuid-unit-of-measure-id'
    })
    unitOfMeasureId: string;

    @Column({ name: 'MAPPING', type: 'varchar2', length: 500, nullable: true })
    @ApiProperty({
        description: 'Thông tin mapping (JSON string)',
        example: '{"hisCode": "LAB001", "externalSystem": "LIS"}',
        maxLength: 500,
        required: false
    })
    mapping?: string;

    @Column({ name: 'NUM_ORDER', type: 'number', default: 0 })
    @ApiProperty({
        description: 'Số thứ tự',
        example: 1
    })
    numOrder: number;

    @Column({ name: 'CURRENT_PRICE', type: 'decimal', precision: 10, scale: 2, nullable: true })
    @ApiProperty({
        description: 'Giá hiện tại (denormalized for performance)',
        example: 150000.00,
        required: false
    })
    currentPrice?: number;

    @Column({ name: 'PARENT_SERVICE_ID', type: 'varchar2', length: 36, nullable: true })
    @ApiProperty({
        description: 'ID dịch vụ cha (self-reference)',
        example: 'uuid-parent-service-id',
        required: false
    })
    parentServiceId?: string;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Trạng thái hoạt động', example: true })
    isActiveFlag: number;

    // Relationships
    @ManyToOne(() => ServiceGroup)
    @JoinColumn({ name: 'SERVICE_GROUP_ID', foreignKeyConstraintName: 'FK_SERVICE_SERVICE_GROUP' })
    serviceGroup?: ServiceGroup;

    @ManyToOne(() => UnitOfMeasure)
    @JoinColumn({ name: 'UNIT_OF_MEASURE_ID', foreignKeyConstraintName: 'FK_SERVICE_UNIT_OF_MEASURE' })
    unitOfMeasure?: UnitOfMeasure;

    @ManyToOne(() => Service, service => service.subServices)
    @JoinColumn({ name: 'PARENT_SERVICE_ID', foreignKeyConstraintName: 'FK_SERVICE_PARENT_SERVICE' })
    parentService?: Service;

    @OneToMany(() => Service, service => service.parentService)
    subServices?: Service[];

    @OneToMany(() => ServicePriceHistory, priceHistory => priceHistory.service)
    priceHistory?: ServicePriceHistory[];

    // Business methods
    isServiceActive(): boolean {
        return this.isActiveFlag === 1 && super.isActive();
    }

    activate(): void {
        this.isActiveFlag = 1;
        this.deletedAt = undefined;
    }

    deactivate(): void {
        this.isActiveFlag = 0;
        this.softDelete();
    }

    getDisplayName(): string {
        return `${this.serviceCode} - ${this.serviceName}`;
    }

    getShortDisplayName(): string {
        return this.shortName;
    }

    hasMapping(): boolean {
        return this.mapping && this.mapping.trim().length > 0;
    }

    parseMapping(): any {
        try {
            return this.mapping ? JSON.parse(this.mapping) : null;
        } catch (error) {
            return null;
        }
    }

    isSubService(): boolean {
        return this.parentServiceId !== null && this.parentServiceId !== undefined;
    }

    isParentService(): boolean {
        return this.subServices && this.subServices.length > 0;
    }

    getFormattedPrice(): string {
        if (!this.currentPrice) return '0 VND';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(this.currentPrice);
    }

    getFullHierarchy(): string {
        const parts = [this.serviceName];
        if (this.serviceGroup?.serviceGroupName) {
            parts.push(`(${this.serviceGroup.serviceGroupName})`);
        }
        return parts.join(' ');
    }

    // Price history methods
    async getPriceAtDate(date: Date): Promise<number> {
        // This would be implemented in the service layer
        // For now, return current price
        return this.currentPrice || 0;
    }

    getPriceHistory(): ServicePriceHistory[] {
        return this.priceHistory || [];
    }
}
