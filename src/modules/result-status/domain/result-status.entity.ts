import { Entity, PrimaryColumn, Column, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('BMM_RESULT_STATUSES')
@Index('IDX_BMM_RS_CODE', ['statusCode'])
@Index('IDX_BMM_RS_ORDER', ['orderNumber'])
@Index('IDX_BMM_RS_ACTIVE', ['isActiveFlag'])
@Index('UK_BMM_RS_CODE', ['statusCode'], { unique: true })
export class ResultStatus extends BaseEntity {

    @Column({ name: 'STATUS_CODE', type: 'varchar2', length: 20 })
    @ApiProperty({ description: 'Status Code', example: 'PENDING' })
    statusCode: string;

    @Column({ name: 'STATUS_NAME', type: 'varchar2', length: 200 })
    @ApiProperty({ description: 'Status Name', example: 'Đang chờ xử lý' })
    statusName: string;

    @Column({ name: 'ORDER_NUMBER', type: 'number' })
    @ApiProperty({ description: 'Order Number', example: 1 })
    orderNumber: number;

    @Column({ name: 'DESCRIPTION', type: 'varchar2', length: 500, nullable: true })
    @ApiProperty({ description: 'Description', example: 'Trạng thái chờ xử lý kết quả', required: false })
    description?: string;

    @Column({ name: 'COLOR_CODE', type: 'varchar2', length: 20, nullable: true })
    @ApiProperty({ description: 'Color Code for UI', example: '#FFA500', required: false })
    colorCode?: string;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is Active', example: true })
    isActiveFlag: number;

    // Business methods
    isActive(): boolean {
        return this.isActiveFlag === 1;
    }

    getDisplayName(): string {
        return `${this.statusCode} - ${this.statusName}`;
    }
}
