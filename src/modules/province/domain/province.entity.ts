import {
    Entity,
    Column,
    Index,
    OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('BMM_PROVINCES')
@Index('IDX_BMM_PROV_NAME', ['provinceName'])
@Index('IDX_BMM_PROV_ACTIVE', ['isActiveFlag'])
@Index('IDX_BMM_PROV_CREATED', ['createdAt'])
export class Province extends BaseEntity {

    @Column({ name: 'PROVINCE_CODE', type: 'varchar2', length: 10, unique: true })
    @ApiProperty({ description: 'Province code', example: '01' })
    provinceCode: string;

    @Column({ name: 'PROVINCE_NAME', type: 'varchar2', length: 100 })
    @ApiProperty({ description: 'Province name', example: 'Hà Nội' })
    provinceName: string;

    @Column({ name: 'SHORT_NAME', type: 'varchar2', length: 50, nullable: true })
    @ApiProperty({ description: 'Province short name', example: 'HN', required: false })
    shortName?: string;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is province active', example: true })
    isActiveFlag: number;


    // Business methods
    isProvinceActive(): boolean {
        return this.isActiveFlag === 1 && super.isActive();
    }

    activate(): void {
        this.isActiveFlag = 1;
    }

    deactivate(): void {
        this.isActiveFlag = 0;
    }

    // Relationship
    @OneToMany('Ward', 'province')
    wards?: any[];
}
