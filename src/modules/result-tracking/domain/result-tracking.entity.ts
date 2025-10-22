import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ServiceRequest } from '../../service-request/domain/service-request.entity';
import { ResultStatus } from '../../result-status/domain/result-status.entity';
import { Room } from '../../room/domain/room.entity';

@Entity('BMM_RESULT_TRACKINGS')
@Index('IDX_BMM_RT_SR_ID', ['serviceRequestId'])
@Index('IDX_BMM_RT_STATUS_ID', ['resultStatusId'])
@Index('IDX_BMM_RT_ROOM_ID', ['roomId'])
@Index('IDX_BMM_RT_IN_TIME', ['inTrackingTime'])
@Index('IDX_BMM_RT_OUT_TIME', ['outTrackingTime'])
@Index('IDX_BMM_RT_SR_STATUS', ['serviceRequestId', 'resultStatusId'])
export class ResultTracking extends BaseEntity {
    @Column({ name: 'SERVICE_REQUEST_ID', type: 'varchar2', length: 36 })
    @ApiProperty({ description: 'Service Request ID', example: 'uuid-service-request-id' })
    serviceRequestId: string;

    @Column({ name: 'RESULT_STATUS_ID', type: 'varchar2', length: 36 })
    @ApiProperty({ description: 'Result Status ID', example: 'uuid-result-status-id' })
    resultStatusId: string;

    @Column({ name: 'ROOM_ID', type: 'varchar2', length: 36, nullable: true })
    @ApiProperty({ description: 'Room ID', example: 'uuid-room-id', required: false })
    roomId?: string;

    @Column({ name: 'IN_TRACKING_TIME', type: 'timestamp', nullable: true })
    @ApiProperty({ description: 'In Tracking Time', example: '2024-01-15T10:30:00Z', required: false })
    inTrackingTime?: Date;

    @Column({ name: 'OUT_TRACKING_TIME', type: 'timestamp', nullable: true })
    @ApiProperty({ description: 'Out Tracking Time', example: '2024-01-15T11:30:00Z', required: false })
    outTrackingTime?: Date;

    @Column({ name: 'NOTE', type: 'varchar2', length: 1000, nullable: true })
    @ApiProperty({ description: 'Note', example: 'Sample processed successfully', required: false })
    note?: string;

    // Relationships
    @ManyToOne(() => ServiceRequest, { eager: false })
    @JoinColumn({ name: 'SERVICE_REQUEST_ID' })
    serviceRequest?: ServiceRequest;

    @ManyToOne(() => ResultStatus, { eager: false })
    @JoinColumn({ name: 'RESULT_STATUS_ID' })
    resultStatus?: ResultStatus;

    @ManyToOne(() => Room, { eager: false })
    @JoinColumn({ name: 'ROOM_ID' })
    room?: Room;

    // Business methods
    isCurrentlyInRoom(): boolean {
        return !!this.inTrackingTime && !this.outTrackingTime;
    }

    getTrackingDuration(): number | null {
        if (this.inTrackingTime && this.outTrackingTime) {
            return this.outTrackingTime.getTime() - this.inTrackingTime.getTime();
        }
        return null;
    }

    getTrackingDurationInMinutes(): number | null {
        const duration = this.getTrackingDuration();
        return duration ? Math.round(duration / (1000 * 60)) : null;
    }

    isCompleted(): boolean {
        return !!this.outTrackingTime;
    }

    getStatus(): string {
        if (!this.inTrackingTime) return 'NOT_STARTED';
        if (!this.outTrackingTime) return 'IN_PROGRESS';
        return 'COMPLETED';
    }
}
