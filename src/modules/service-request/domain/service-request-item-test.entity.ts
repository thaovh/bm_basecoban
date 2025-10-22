import {
    Entity,
    Column,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ServiceRequestItem } from './service-request-item.entity';
import { ServiceTest } from '../../service-test/domain/service-test.entity';

@Entity('BMM_SR_ITEM_TESTS')
@Index('IDX_BMM_SR_ITEM_TESTS_SR_ID', ['serviceRequestItemId'])
@Index('IDX_BMM_SR_ITEM_TESTS_TEST_ID', ['serviceTestId'])
@Index('IDX_BMM_SR_ITEM_TESTS_ACTIVE', ['isActiveFlag'])
export class ServiceRequestItemTest extends BaseEntity {

    @Column({ name: 'SR_ITEM_ID', type: 'varchar2', length: 36 })
    @ApiProperty({ description: 'Service Request Item ID', example: 'uuid-service-request-item-id' })
    serviceRequestItemId: string;

    @Column({ name: 'SERVICE_TEST_ID', type: 'varchar2', length: 36 })
    @ApiProperty({ description: 'Service Test ID', example: 'uuid-service-test-id' })
    serviceTestId: string;

    @Column({ name: 'TEST_CODE', type: 'varchar2', length: 50 })
    @ApiProperty({ description: 'Test Code', example: 'TEST_002' })
    testCode: string;

    @Column({ name: 'TEST_NAME', type: 'varchar2', length: 200 })
    @ApiProperty({ description: 'Test Name', example: 'Xet nghiem dien giai do' })
    testName: string;

    @Column({ name: 'SHORT_NAME', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'Short Name', example: 'XN Dien giai do', required: false })
    shortName?: string;

    @Column({ name: 'TEST_ORDER', type: 'number', default: 1 })
    @ApiProperty({ description: 'Test Order', example: 1 })
    testOrder: number;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is Active', example: true })
    isActiveFlag: number;

    // Relationships
    @ManyToOne(() => ServiceRequestItem, item => item.serviceRequestItemTests)
    @JoinColumn({ name: 'SR_ITEM_ID' })
    serviceRequestItem: ServiceRequestItem;

    @ManyToOne(() => ServiceTest)
    @JoinColumn({ name: 'SERVICE_TEST_ID' })
    serviceTest: ServiceTest;

    // Business methods
    isServiceRequestItemTestActive(): boolean {
        return this.isActiveFlag === 1 && super.isActive();
    }
}
