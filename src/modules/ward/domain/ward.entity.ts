import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    VersionColumn,
    Index,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';
import { Province } from '../../province/domain/province.entity';

@Entity('BMM_WARDS')
@Index('IDX_BMM_WARD_NAME', ['wardName'])
@Index('IDX_BMM_WARD_ACTIVE', ['isActive'])
@Index('IDX_BMM_WARD_CREATED', ['createdAt'])
@Index('IDX_BMM_WARD_PROVINCE', ['provinceId'])
export class Ward {
    @PrimaryColumn({ name: 'ID', type: 'varchar2', length: 36 })
    id: string;

    @Column({ name: 'WARD_CODE', type: 'varchar2', length: 10, unique: true })
    @ApiProperty({ description: 'Ward code', example: '001' })
    wardCode: string;

    @Column({ name: 'WARD_NAME', type: 'varchar2', length: 100 })
    @ApiProperty({ description: 'Ward name', example: 'Phường Bến Nghé' })
    wardName: string;

    @Column({ name: 'PROVINCE_ID', type: 'varchar2', length: 36 })
    @ApiProperty({ description: 'Province ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525' })
    provinceId: string;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is ward active', example: true })
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

    // Relationship
    @ManyToOne(() => Province, province => province.wards)
    @JoinColumn({ name: 'PROVINCE_ID' })
    province?: Province;

    // Auto-generate UUID before insert
    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }

    // Business methods
    isWardActive(): boolean {
        return this.isActive === 1 && !this.deletedAt;
    }

    activate(): void {
        this.isActive = 1;
    }

    deactivate(): void {
        this.isActive = 0;
    }

    getFullAddress(): string {
        return `${this.wardName}, ${this.province?.provinceName || ''}`;
    }
}
