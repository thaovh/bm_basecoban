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

@Entity('BMM_PATIENTS')
@Index('IDX_BMM_PATIENTS_PATIENT_CODE', ['patientCode'])
@Index('IDX_BMM_PATIENTS_HIS_ID', ['hisId'])
@Index('IDX_BMM_PATIENTS_IS_ACTIVE', ['isActiveFlag'])
export class Patient extends BaseEntity {

    @Column({ name: 'PATIENT_CODE', type: 'varchar2', length: 50, unique: true })
    @ApiProperty({ description: 'Patient code', example: '0003110473' })
    patientCode: string;

    @Column({ name: 'PATIENT_NAME', type: 'varchar2', length: 200 })
    @ApiProperty({ description: 'Patient name', example: 'NGUYỄN THỊ QUÝ' })
    patientName: string;

    @Column({ name: 'DATE_OF_BIRTH', type: 'date' })
    @ApiProperty({ description: 'Date of birth', example: '1989-01-04' })
    dateOfBirth: Date;

    @Column({ name: 'CMND_NUMBER', type: 'varchar2', length: 20, nullable: true })
    @ApiProperty({ description: 'CMND/CCCD number', example: '025189009861', required: false })
    cmndNumber?: string;

    @Column({ name: 'CMND_DATE', type: 'date', nullable: true })
    @ApiProperty({ description: 'CMND/CCCD issue date', example: '2021-06-25', required: false })
    cmndDate?: Date;

    @Column({ name: 'CMND_PLACE', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'CMND/CCCD issue place', example: 'CA HCM', required: false })
    cmndPlace?: string;

    @Column({ name: 'MOBILE', type: 'varchar2', length: 20, nullable: true })
    @ApiProperty({ description: 'Mobile phone', example: '0902267672', required: false })
    mobile?: string;

    @Column({ name: 'PHONE', type: 'varchar2', length: 20, nullable: true })
    @ApiProperty({ description: 'Landline phone', example: '0281234567', required: false })
    phone?: string;

    @Column({ name: 'PROVINCE_ID', type: 'varchar2', length: 36, nullable: true })
    @ApiProperty({ description: 'Province ID', example: 'uuid-province-id', required: false })
    provinceId?: string;

    @Column({ name: 'WARD_ID', type: 'varchar2', length: 36, nullable: true })
    @ApiProperty({ description: 'Ward ID', example: 'uuid-ward-id', required: false })
    wardId?: string;

    @Column({ name: 'ADDRESS', type: 'clob' })
    @ApiProperty({ description: 'Full address', example: 'KHU 1 Ninh Dân, Xã Hoàng Cương, Phú Thọ' })
    address: string;

    @Column({ name: 'GENDER_ID', type: 'number' })
    @ApiProperty({ description: 'Gender ID', example: 1 })
    genderId: number;

    @Column({ name: 'GENDER_NAME', type: 'varchar2', length: 50 })
    @ApiProperty({ description: 'Gender name', example: 'Nữ' })
    genderName: string;

    @Column({ name: 'CAREER_NAME', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'Career/Profession', example: 'Không xác định', required: false })
    careerName?: string;

    @Column({ name: 'HIS_ID', type: 'number', nullable: true })
    @ApiProperty({ description: 'HIS Patient ID', example: 3110600, required: false })
    hisId?: number;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is patient active', example: true })
    isActiveFlag: number;

    // Relationships
    @ManyToOne(() => Province, { nullable: true })
    @JoinColumn({ name: 'PROVINCE_ID', foreignKeyConstraintName: 'FK_PATIENT_PROVINCE' })
    province?: Province;

    @ManyToOne(() => Ward, { nullable: true })
    @JoinColumn({ name: 'WARD_ID', foreignKeyConstraintName: 'FK_PATIENT_WARD' })
    ward?: Ward;

    // Business methods
    isPatientActive(): boolean {
        return this.isActiveFlag === 1 && super.isActive();
    }

    getFullName(): string {
        return this.patientName;
    }

    getFullAddress(): string {
        return `${this.address}, ${this.ward?.wardName || ''}, ${this.province?.provinceName || ''}`;
    }

    activate(): void {
        this.isActiveFlag = 1;
    }

    deactivate(): void {
        this.isActiveFlag = 0;
    }
}
