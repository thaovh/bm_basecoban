import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    VersionColumn,
    Index,
    OneToMany,
    BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

@Entity('BMM_PROVINCES')
@Index('IDX_BMM_PROV_NAME', ['provinceName'])
@Index('IDX_BMM_PROV_ACTIVE', ['isActive'])
@Index('IDX_BMM_PROV_CREATED', ['createdAt'])
export class Province {
    @PrimaryColumn({ name: 'ID', type: 'varchar2', length: 36 })
    id: string;

    @Column({ name: 'PROVINCE_CODE', type: 'varchar2', length: 10, unique: true })
    @ApiProperty({ description: 'Province code', example: '01' })
    provinceCode: string;

    @Column({ name: 'PROVINCE_NAME', type: 'varchar2', length: 100 })
    @ApiProperty({ description: 'Province name', example: 'Hà Nội' })
    provinceName: string;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is province active', example: true })
    isActive: number;

    @CreateDateColumn({ name: 'CREATED_AT' })
    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'UPDATED_AT' })
    @ApiProperty({ description: 'Last update timestamp', example: '2024-01-15T10:30:00Z' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'DELETED_AT', nullable: true })
    deletedAt?: Date;

    @Column({ name: 'CREATED_BY', type: 'varchar2', length: 50, nullable: true })
    createdBy?: string;

    @Column({ name: 'UPDATED_BY', type: 'varchar2', length: 50, nullable: true })
    updatedBy?: string;

    @VersionColumn({ name: 'VERSION' })
    version: number;

    // Auto-generate UUID before insert
    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }

    // Business methods
    isProvinceActive(): boolean {
        return this.isActive === 1 && !this.deletedAt;
    }

    activate(): void {
        this.isActive = 1;
    }

    deactivate(): void {
        this.isActive = 0;
    }

    // Relationship
    @OneToMany('Ward', 'province')
    wards?: any[];
}
