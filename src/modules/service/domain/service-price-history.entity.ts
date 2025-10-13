import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Service } from './service.entity';

@Entity('BMM_SERVICE_PRICE_HISTORY')
export class ServicePriceHistory extends BaseEntity {
    @Column({ name: 'SERVICE_ID', type: 'varchar2', length: 36 })
    @ApiProperty({
        description: 'ID dịch vụ',
        example: 'uuid-service-id'
    })
    serviceId: string;

    @Column({ name: 'PRICE', type: 'decimal', precision: 10, scale: 2 })
    @ApiProperty({
        description: 'Giá tại thời điểm',
        example: 150000.00
    })
    price: number;

    @Column({ name: 'EFFECTIVE_FROM', type: 'timestamp' })
    @ApiProperty({
        description: 'Có hiệu lực từ ngày',
        example: '2024-01-01T00:00:00Z'
    })
    effectiveFrom: Date;

    @Column({ name: 'EFFECTIVE_TO', type: 'timestamp', nullable: true })
    @ApiProperty({
        description: 'Có hiệu lực đến ngày (NULL = hiện tại)',
        example: '2024-12-31T23:59:59Z',
        required: false
    })
    effectiveTo?: Date;

    @Column({ name: 'REASON', type: 'varchar2', length: 500, nullable: true })
    @ApiProperty({
        description: 'Lý do thay đổi giá',
        example: 'Tăng giá theo quy định mới',
        maxLength: 500,
        required: false
    })
    reason?: string;

    // Relationship
    @ManyToOne(() => Service, service => service.priceHistory)
    @JoinColumn({ name: 'SERVICE_ID', foreignKeyConstraintName: 'FK_SERVICE_PRICE_HISTORY_SERVICE' })
    service?: Service;

    // Business methods
    isCurrentPrice(): boolean {
        return this.effectiveTo === null || this.effectiveTo === undefined;
    }

    isEffectiveAt(date: Date): boolean {
        const from = this.effectiveFrom;
        const to = this.effectiveTo || new Date();
        return date >= from && date <= to;
    }

    getFormattedPrice(): string {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(this.price);
    }

    getDuration(): string {
        const from = this.effectiveFrom;
        const to = this.effectiveTo || new Date();
        const diffTime = Math.abs(to.getTime() - from.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} ngày`;
    }
}
