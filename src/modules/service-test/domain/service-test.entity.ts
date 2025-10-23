import { Entity, Column, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UnitOfMeasure } from '../../unit-of-measure/domain/unit-of-measure.entity';
import { Service } from '../../service/domain/service.entity';

@Entity('BMM_SERVICE_TESTS')
@Unique('UK_SERVICE_TEST_CODE', ['testCode'])
export class ServiceTest extends BaseEntity {
    @Column({ name: 'TEST_CODE', type: 'varchar2', length: 50 })
    testCode: string;

    @Column({ name: 'TEST_NAME', type: 'varchar2', length: 200 })
    testName: string;

    @Column({ name: 'SHORT_NAME', type: 'varchar2', length: 50 })
    shortName: string;

    @Column({ name: 'SERVICE_ID', type: 'varchar2', length: 36 })
    serviceId: string;

    @Column({ name: 'UNIT_OF_MEASURE_ID', type: 'varchar2', length: 36 })
    unitOfMeasureId: string;

    @Column({ name: 'RANGE_TEXT', type: 'varchar2', length: 500, nullable: true })
    rangeText?: string;

    @Column({ name: 'RANGE_LOW', type: 'number', nullable: true })
    rangeLow?: number;

    @Column({ name: 'RANGE_HIGH', type: 'number', nullable: true })
    rangeHigh?: number;

    @Column({ name: 'MAPPING', type: 'varchar2', length: 500, nullable: true })
    mapping?: string;

    @Column({ name: 'TEST_ORDER', type: 'number', default: 0 })
    testOrder: number;

    @Column({ name: 'IS_ACTIVE_FLAG', type: 'number', default: 1 })
    isActiveFlag: number;

    // Test Status and Results
    @Column({ name: 'TEST_STATUS', type: 'varchar2', length: 20, default: 'PENDING' })
    testStatus?: string;

    @Column({ name: 'EXPECTED_RESULT', type: 'varchar2', length: 200, nullable: true })
    expectedResult?: string;

    @Column({ name: 'ACTUAL_RESULT', type: 'varchar2', length: 200, nullable: true })
    actualResult?: string;

    @Column({ name: 'RESULT_UNIT', type: 'varchar2', length: 50, nullable: true })
    resultUnit?: string;

    @Column({ name: 'NORMAL_RANGE', type: 'varchar2', length: 100, nullable: true })
    normalRange?: string;

    @Column({ name: 'CRITICAL_VALUES', type: 'clob', nullable: true })
    criticalValues?: string;

    @Column({ name: 'TEST_METHOD', type: 'varchar2', length: 100, nullable: true })
    testMethod?: string;

    @Column({ name: 'SPECIMEN_TYPE', type: 'varchar2', length: 100, nullable: true })
    specimenType?: string;

    @Column({ name: 'PROCESSING_TIME', type: 'varchar2', length: 50, nullable: true })
    processingTime?: string;

    // Relationships
    @ManyToOne(() => Service)
    @JoinColumn({ name: 'SERVICE_ID' })
    service?: Service;

    @ManyToOne(() => UnitOfMeasure)
    @JoinColumn({ name: 'UNIT_OF_MEASURE_ID' })
    unitOfMeasure?: UnitOfMeasure;

    // Business methods
    getFullTestName(): string {
        return `${this.testCode} - ${this.testName}`;
    }

    isInRange(value: number): boolean {
        if (this.rangeLow === null || this.rangeHigh === null) {
            return true; // No range defined
        }
        return value >= this.rangeLow && value <= this.rangeHigh;
    }

    isActive(): boolean {
        return this.isActiveFlag === 1 && !this.deletedAt;
    }
}
