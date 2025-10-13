import { Entity, Column, Index, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('BMM_UNIT_OF_MEASURES')
@Unique('UK_UOM_CODE', ['unitOfMeasureCode'])
@Index('IDX_BMM_UOM_CODE', ['unitOfMeasureCode'])
@Index('IDX_BMM_UOM_NAME', ['unitOfMeasureName'])
@Index('IDX_BMM_UOM_ACTIVE', ['isActiveFlag'])
export class UnitOfMeasure extends BaseEntity {
    @Column({ name: 'UNIT_OF_MEASURE_CODE', type: 'varchar2', length: 20 })
    @ApiProperty({
        description: 'Mã đơn vị tính (unique identifier)',
        example: 'ML',
        maxLength: 20
    })
    unitOfMeasureCode: string;

    @Column({ name: 'UNIT_OF_MEASURE_NAME', type: 'varchar2', length: 200 })
    @ApiProperty({
        description: 'Tên đơn vị tính',
        example: 'Milliliter',
        maxLength: 200
    })
    unitOfMeasureName: string;

    @Column({ name: 'DESCRIPTION', type: 'varchar2', length: 500, nullable: true })
    @ApiProperty({
        description: 'Mô tả đơn vị tính',
        example: 'Đơn vị đo thể tích chất lỏng',
        maxLength: 500,
        required: false
    })
    description?: string;

    @Column({ name: 'MAPPING', type: 'varchar2', length: 500, nullable: true })
    @ApiProperty({
        description: 'Thông tin mapping (JSON string hoặc text mapping)',
        example: '{"hisCode": "ML", "externalSystem": "LIS", "conversionFactor": 1}',
        maxLength: 500,
        required: false
    })
    mapping?: string;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Trạng thái hoạt động', example: true })
    isActiveFlag: number;

    // Business methods
    isUnitOfMeasureActive(): boolean {
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
        return `${this.unitOfMeasureCode} - ${this.unitOfMeasureName}`;
    }

    getShortDisplayName(): string {
        return this.unitOfMeasureCode;
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

    getConversionFactor(): number {
        const mapping = this.parseMapping();
        return mapping?.conversionFactor || 1;
    }
}
