import {
    Entity,
    Column,
    Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('BMM_SAMPLE_TYPES')
@Unique('UK_SAMPLE_TYPE_CODE', ['typeCode'])
export class SampleType extends BaseEntity {

    @Column({ name: 'TYPE_CODE', type: 'varchar2', length: 20 })
    @ApiProperty({ description: 'Sample type code', example: 'BLD' })
    typeCode: string;

    @Column({ name: 'TYPE_NAME', type: 'varchar2', length: 200 })
    @ApiProperty({ description: 'Sample type name', example: 'Mẫu máu' })
    typeName: string;

    @Column({ name: 'SHORT_NAME', type: 'varchar2', length: 50, nullable: true })
    @ApiProperty({ description: 'Sample type short name', example: 'Máu', required: false })
    shortName?: string;

    @Column({ name: 'CODE_GENERATION_RULE', type: 'varchar2', length: 500, nullable: true })
    @ApiProperty({
        description: 'Code generation rule in JSON format',
        example: '{"prefix": "BLD", "sequence": "0001", "format": "{PREFIX}-{SEQUENCE}"}',
        required: false
    })
    codeGenerationRule?: string;

    @Column({ name: 'DESCRIPTION', type: 'varchar2', length: 500, nullable: true })
    @ApiProperty({ description: 'Sample type description', example: 'Mẫu máu để xét nghiệm', required: false })
    description?: string;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is sample type active', example: true })
    isActiveFlag: number;

    // Business methods
    isSampleTypeActive(): boolean {
        return this.isActiveFlag === 1 && super.isActive();
    }

    activate(): void {
        this.isActiveFlag = 1;
        this.deletedAt = undefined;
    }

    deactivate(): void {
        this.isActiveFlag = 0;
        this.softDelete();
    }

    getDisplayName(): string {
        return `${this.typeCode} - ${this.typeName}`;
    }

    getShortDisplayName(): string {
        return this.shortName || this.typeName;
    }

    parseCodeGenerationRule(): any {
        try {
            return this.codeGenerationRule ? JSON.parse(this.codeGenerationRule) : null;
        } catch (error) {
            return null;
        }
    }

    generateSampleCode(sequence: number): string {
        const rule = this.parseCodeGenerationRule();
        if (!rule) {
            return `${this.typeCode}-${sequence.toString().padStart(4, '0')}`;
        }

        const { prefix, format } = rule;
        const paddedSequence = sequence.toString().padStart(4, '0');

        return format
            .replace('{PREFIX}', prefix || this.typeCode)
            .replace('{SEQUENCE}', paddedSequence);
    }
}
