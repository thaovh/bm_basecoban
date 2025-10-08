import {
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Column,
    VersionColumn,
    BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEntity {
    @PrimaryColumn({ name: 'ID', type: 'varchar2', length: 36 })
    id: string;

    @CreateDateColumn({ name: 'CREATED_AT' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'UPDATED_AT' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'DELETED_AT', nullable: true })
    deletedAt?: Date;

    @Column({ name: 'CREATED_BY', type: 'varchar2', length: 50, nullable: true })
    createdBy?: string;

    @Column({ name: 'UPDATED_BY', type: 'varchar2', length: 50, nullable: true })
    updatedBy?: string;

    @VersionColumn({ name: 'VERSION' })
    version: number;

    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }

    // Common business methods
    isActive(): boolean {
        return !this.deletedAt;
    }

    isDeleted(): boolean {
        return !!this.deletedAt;
    }

    softDelete(): void {
        this.deletedAt = new Date();
    }

    restore(): void {
        this.deletedAt = null;
    }

    updateAuditFields(updatedBy?: string): void {
        this.updatedAt = new Date();
        if (updatedBy) {
            this.updatedBy = updatedBy;
        }
    }

    setCreatedBy(createdBy: string): void {
        this.createdBy = createdBy;
    }
}
