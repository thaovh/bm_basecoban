import {
    Entity,
    Column,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Province } from '../../province/domain/province.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('BMM_WARDS')
@Index('IDX_BMM_WARD_NAME', ['wardName'])
@Index('IDX_BMM_WARD_ACTIVE', ['isActiveFlag'])
@Index('IDX_BMM_WARD_CREATED', ['createdAt'])
@Index('IDX_BMM_WARD_PROVINCE', ['provinceId'])
export class Ward extends BaseEntity {

    @Column({ name: 'WARD_CODE', type: 'varchar2', length: 10, unique: true })
    @ApiProperty({ description: 'Ward code', example: '001' })
    wardCode: string;

    @Column({ name: 'WARD_NAME', type: 'varchar2', length: 100 })
    @ApiProperty({ description: 'Ward name', example: 'Phường Bến Nghé' })
    wardName: string;

    @Column({ name: 'SHORT_NAME', type: 'varchar2', length: 50, nullable: true })
    @ApiProperty({ description: 'Ward short name', example: 'BN', required: false })
    shortName?: string;

    @Column({ name: 'PROVINCE_ID', type: 'varchar2', length: 36 })
    @ApiProperty({ description: 'Province ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525' })
    provinceId: string;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is ward active', example: true })
    isActiveFlag: number;

    // Relationship
    @ManyToOne(() => Province, province => province.wards)
    @JoinColumn({ name: 'PROVINCE_ID' })
    province?: Province;

    // Business methods
    isWardActive(): boolean {
        return this.isActiveFlag === 1 && super.isActive();
    }

    activate(): void {
        this.isActiveFlag = 1;
    }

    deactivate(): void {
        this.isActiveFlag = 0;
    }

    getFullAddress(): string {
        return `${this.wardName}, ${this.province?.provinceName || ''}`;
    }
}
