import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Department } from '../../department/domain/department.entity';

@Entity('BMM_ROOMS')
@Unique('UK_ROOM_CODE', ['roomCode'])
export class Room extends BaseEntity {

    @Column({ name: 'ROOM_CODE', type: 'varchar2', length: 20 })
    @ApiProperty({ description: 'Room code', example: 'R001' })
    roomCode: string;

    @Column({ name: 'ROOM_NAME', type: 'varchar2', length: 200 })
    @ApiProperty({ description: 'Room name', example: 'Phòng Khám Tim Mạch 1' })
    roomName: string;

    @Column({ name: 'ROOM_ADDRESS', type: 'varchar2', length: 500 })
    @ApiProperty({ description: 'Room address', example: 'Tầng 2, Khu A, Khoa Tim Mạch' })
    roomAddress: string;

    @Column({ name: 'DEPARTMENT_ID', type: 'varchar2', length: 36 })
    @ApiProperty({ description: 'Department ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525' })
    departmentId: string;

    @Column({ name: 'DESCRIPTION', type: 'varchar2', length: 500, nullable: true })
    @ApiProperty({ description: 'Room description', example: 'Phòng khám chuyên khoa tim mạch', required: false })
    description?: string;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is room active', example: true })
    isActiveFlag: number;

    // Relationships
    @ManyToOne(() => Department)
    @JoinColumn({ name: 'DEPARTMENT_ID', foreignKeyConstraintName: 'FK_ROOM_DEPT' })
    department?: Department;

    // Business methods
    isRoomActive(): boolean {
        return this.isActiveFlag === 1 && super.isActive();
    }

    activate(): void {
        this.isActiveFlag = 1;
    }

    deactivate(): void {
        this.isActiveFlag = 0;
    }

    getDisplayName(): string {
        return `${this.roomCode} - ${this.roomName}`;
    }

    getFullAddress(): string {
        const parts = [this.roomAddress];
        if (this.department?.departmentName) {
            parts.push(`(${this.department.departmentName})`);
        }
        return parts.join(' ');
    }
}
