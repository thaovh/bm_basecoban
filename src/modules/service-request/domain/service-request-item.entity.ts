import {
    Entity,
    Column,
    Index,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ServiceRequest } from './service-request.entity';
import { Service } from '../../service/domain/service.entity';
import { ServiceGroup } from '../../service-group/domain/service-group.entity';
import { UnitOfMeasure } from '../../unit-of-measure/domain/unit-of-measure.entity';
import { ServiceRequestItemTest } from './service-request-item-test.entity';

@Entity('BMM_SERVICE_REQ_ITEMS')
@Index('IDX_BMM_SR_ITEMS_SR_ID', ['serviceRequestId'])
@Index('IDX_BMM_SR_ITEMS_HIS_ID', ['hisSereServId'])
@Index('IDX_BMM_SR_ITEMS_LIS_ID', ['lisServiceId'])
@Index('IDX_BMM_SR_ITEMS_ACTIVE', ['isActiveFlag'])
export class ServiceRequestItem extends BaseEntity {

    // Service Request Reference
    @Column({ name: 'SR_ID', type: 'varchar2', length: 36 })
    @ApiProperty({ description: 'Service Request ID', example: 'uuid-service-request-id' })
    serviceRequestId: string;

    // HIS Integration Fields
    @Column({ name: 'HIS_SERE_SERV_ID', type: 'number' })
    @ApiProperty({ description: 'HIS Sere Serv ID', example: 110006624 })
    hisSereServId: number;

    @Column({ name: 'HIS_SERVICE_ID', type: 'number' })
    @ApiProperty({ description: 'HIS Service ID', example: 5853 })
    hisServiceId: number;

    @Column({ name: 'HIS_SERVICE_CODE', type: 'varchar2', length: 50 })
    @ApiProperty({ description: 'HIS Service Code', example: 'BM00132' })
    hisServiceCode: string;

    @Column({ name: 'HIS_SERVICE_NAME', type: 'varchar2', length: 200 })
    @ApiProperty({ description: 'HIS Service Name', example: 'Điện giải đồ (Na, K, Cl)' })
    hisServiceName: string;

    @Column({ name: 'HIS_PRICE', type: 'decimal', precision: 10, scale: 2 })
    @ApiProperty({ description: 'HIS Price', example: 30200 })
    hisPrice: number;

    // LIS Service Reference
    @Column({ name: 'LIS_SERVICE_ID', type: 'varchar2', length: 36, nullable: true })
    @ApiProperty({ description: 'LIS Service ID', example: 'uuid-lis-service-id', required: false })
    lisServiceId?: string;

    @Column({ name: 'LIS_SERVICE_CODE', type: 'varchar2', length: 50, nullable: true })
    @ApiProperty({ description: 'LIS Service Code', example: 'LAB_001', required: false })
    lisServiceCode?: string;

    @Column({ name: 'LIS_SERVICE_NAME', type: 'varchar2', length: 200, nullable: true })
    @ApiProperty({ description: 'LIS Service Name', example: 'Dien giai do (Na, K, Cl)', required: false })
    lisServiceName?: string;

    @Column({ name: 'LIS_SHORT_NAME', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'LIS Short Name', example: 'Dien giai do', required: false })
    lisShortName?: string;

    @Column({ name: 'LIS_CURRENT_PRICE', type: 'decimal', precision: 10, scale: 2, nullable: true })
    @ApiProperty({ description: 'LIS Current Price', example: 35000, required: false })
    lisCurrentPrice?: number;

    // Service Group & Unit of Measure
    @Column({ name: 'SERVICE_GROUP_ID', type: 'varchar2', length: 36, nullable: true })
    @ApiProperty({ description: 'Service Group ID', example: 'uuid-service-group-id', required: false })
    serviceGroupId?: string;

    @Column({ name: 'SERVICE_GROUP_NAME', type: 'varchar2', length: 200, nullable: true })
    @ApiProperty({ description: 'Service Group Name', example: 'Laboratory Services', required: false })
    serviceGroupName?: string;

    @Column({ name: 'UNIT_OF_MEASURE_ID', type: 'varchar2', length: 36, nullable: true })
    @ApiProperty({ description: 'Unit of Measure ID', example: 'uuid-unit-of-measure-id', required: false })
    unitOfMeasureId?: string;

    @Column({ name: 'UNIT_OF_MEASURE_NAME', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'Unit of Measure Name', example: 'Lan', required: false })
    unitOfMeasureName?: string;

    // Quantity & Pricing
    @Column({ name: 'QUANTITY', type: 'decimal', precision: 10, scale: 2, default: 1 })
    @ApiProperty({ description: 'Quantity', example: 1 })
    quantity: number;

    @Column({ name: 'UNIT_PRICE', type: 'decimal', precision: 10, scale: 2 })
    @ApiProperty({ description: 'Unit Price', example: 30200 })
    unitPrice: number;

    @Column({ name: 'TOTAL_PRICE', type: 'decimal', precision: 15, scale: 2 })
    @ApiProperty({ description: 'Total Price', example: 30200 })
    totalPrice: number;

    // Status & Order
    @Column({ name: 'STATUS', type: 'varchar2', length: 20, default: 'PENDING' })
    @ApiProperty({ description: 'Status', example: 'PENDING' })
    status: string;

    @Column({ name: 'ITEM_ORDER', type: 'number', default: 1 })
    @ApiProperty({ description: 'Item Order', example: 1 })
    itemOrder: number;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is Active', example: true })
    isActiveFlag: number;

    // Relationships
    @ManyToOne(() => ServiceRequest, serviceRequest => serviceRequest.serviceRequestItems)
    @JoinColumn({ name: 'SR_ID' })
    serviceRequest: ServiceRequest;

    @ManyToOne(() => Service, { nullable: true })
    @JoinColumn({ name: 'LIS_SERVICE_ID' })
    lisService?: Service;

    @ManyToOne(() => ServiceGroup, { nullable: true })
    @JoinColumn({ name: 'SERVICE_GROUP_ID' })
    serviceGroup?: ServiceGroup;

    @ManyToOne(() => UnitOfMeasure, { nullable: true })
    @JoinColumn({ name: 'UNIT_OF_MEASURE_ID' })
    unitOfMeasure?: UnitOfMeasure;

    @OneToMany(() => ServiceRequestItemTest, itemTest => itemTest.serviceRequestItem)
    serviceRequestItemTests: ServiceRequestItemTest[];

    // Business methods
    isServiceRequestItemActive(): boolean {
        return this.isActiveFlag === 1 && super.isActive();
    }

    calculateTotalPrice(): number {
        return this.quantity * this.unitPrice;
    }

    getServiceName(): string {
        return this.lisServiceName || this.hisServiceName;
    }

    getServiceCode(): string {
        return this.lisServiceCode || this.hisServiceCode;
    }
}
