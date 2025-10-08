import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Province } from '../../province/domain/province.entity';
import { Ward } from '../../ward/domain/ward.entity';

@Entity('BMM_BRANCHES')
export class Branch extends BaseEntity {

    @Column({ name: 'BRANCH_CODE', type: 'varchar2', length: 20, unique: true })
    @ApiProperty({ description: 'Branch code', example: 'HN001' })
    branchCode: string;

    @Column({ name: 'BRANCH_NAME', type: 'varchar2', length: 200 })
    @ApiProperty({ description: 'Branch name', example: 'Bệnh viện Bạch Mai - Cơ sở Hà Nội' })
    branchName: string;

    @Column({ name: 'SHORT_NAME', type: 'varchar2', length: 50, nullable: true })
    @ApiProperty({ description: 'Branch short name', example: 'BM-HN', required: false })
    shortName?: string;

    @Column({ name: 'PROVINCE_ID', type: 'varchar2', length: 36 })
    @ApiProperty({ description: 'Province ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525' })
    provinceId: string;

    @Column({ name: 'WARD_ID', type: 'varchar2', length: 36 })
    @ApiProperty({ description: 'Ward ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525' })
    wardId: string;

    @Column({ name: 'ADDRESS', type: 'varchar2', length: 500 })
    @ApiProperty({ description: 'Branch address', example: '78 Giải Phóng, Phường Phương Mai, Quận Đống Đa' })
    address: string;

    @Column({ name: 'PHONE_NUMBER', type: 'varchar2', length: 20, nullable: true })
    @ApiProperty({ description: 'Phone number', example: '024-3869-3731', required: false })
    phoneNumber?: string;

    @Column({ name: 'HOSPITAL_LEVEL', type: 'varchar2', length: 50, nullable: true })
    @ApiProperty({ description: 'Hospital level', example: 'Hạng I', required: false })
    hospitalLevel?: string;

    @Column({ name: 'REPRESENTATIVE', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'Representative person', example: 'Nguyễn Văn A', required: false })
    representative?: string;

    @Column({ name: 'BHYT_CODE', type: 'varchar2', length: 20, nullable: true })
    @ApiProperty({ description: 'BHYT code', example: 'BHYT001', required: false })
    bhytCode?: string;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is branch active', example: true })
    isActiveFlag: number;

    // Relationships
    @ManyToOne(() => Province)
    @JoinColumn({ name: 'PROVINCE_ID' })
    province?: Province;

    @ManyToOne(() => Ward)
    @JoinColumn({ name: 'WARD_ID' })
    ward?: Ward;

    // Business methods
    isBranchActive(): boolean {
        return this.isActiveFlag === 1 && super.isActive();
    }

    activate(): void {
        this.isActiveFlag = 1;
    }

    deactivate(): void {
        this.isActiveFlag = 0;
    }

    getFullAddress(): string {
        const parts = [this.address];
        if (this.ward?.wardName) parts.push(this.ward.wardName);
        if (this.province?.provinceName) parts.push(this.province.provinceName);
        return parts.join(', ');
    }
}
