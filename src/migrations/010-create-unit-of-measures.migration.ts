import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUnitOfMeasures1700000010 implements MigrationInterface {
    name = 'CreateUnitOfMeasures1700000010';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create BMM_UNIT_OF_MEASURES table
        await queryRunner.query(`
            CREATE TABLE BMM_UNIT_OF_MEASURES (
                ID VARCHAR2(36) PRIMARY KEY,
                UNIT_OF_MEASURE_CODE VARCHAR2(20) NOT NULL,
                UNIT_OF_MEASURE_NAME VARCHAR2(200) NOT NULL,
                DESCRIPTION VARCHAR2(500),
                MAPPING VARCHAR2(500),
                IS_ACTIVE NUMBER(1,0) DEFAULT 1 NOT NULL,
                CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                DELETED_AT TIMESTAMP,
                CREATED_BY VARCHAR2(50),
                UPDATED_BY VARCHAR2(50),
                VERSION NUMBER DEFAULT 1 NOT NULL
            )
        `);

        // Add unique constraint with shorter name
        await queryRunner.query(`ALTER TABLE BMM_UNIT_OF_MEASURES ADD CONSTRAINT UK_UOM_CODE UNIQUE (UNIT_OF_MEASURE_CODE)`);

        // Create indexes
        await queryRunner.query(`CREATE INDEX IDX_BMM_UOM_CODE ON BMM_UNIT_OF_MEASURES(UNIT_OF_MEASURE_CODE)`);
        await queryRunner.query(`CREATE INDEX IDX_BMM_UOM_NAME ON BMM_UNIT_OF_MEASURES(UNIT_OF_MEASURE_NAME)`);
        await queryRunner.query(`CREATE INDEX IDX_BMM_UOM_ACTIVE ON BMM_UNIT_OF_MEASURES(IS_ACTIVE)`);
        await queryRunner.query(`CREATE INDEX IDX_BMM_UOM_CREATED_AT ON BMM_UNIT_OF_MEASURES(CREATED_AT)`);

        // Insert sample data
        await queryRunner.query(`
            INSERT INTO BMM_UNIT_OF_MEASURES (ID, UNIT_OF_MEASURE_CODE, UNIT_OF_MEASURE_NAME, DESCRIPTION, MAPPING) VALUES 
            ('550e8400-e29b-41d4-a716-446655440011', 'ML', 'Milliliter', 'Đơn vị đo thể tích chất lỏng', '{"hisCode": "ML", "externalSystem": "LIS", "conversionFactor": 1}')
        `);

        await queryRunner.query(`
            INSERT INTO BMM_UNIT_OF_MEASURES (ID, UNIT_OF_MEASURE_CODE, UNIT_OF_MEASURE_NAME, DESCRIPTION, MAPPING) VALUES 
            ('550e8400-e29b-41d4-a716-446655440012', 'MG', 'Milligram', 'Đơn vị đo khối lượng', '{"hisCode": "MG", "externalSystem": "LIS", "conversionFactor": 1}')
        `);

        await queryRunner.query(`
            INSERT INTO BMM_UNIT_OF_MEASURES (ID, UNIT_OF_MEASURE_CODE, UNIT_OF_MEASURE_NAME, DESCRIPTION, MAPPING) VALUES 
            ('550e8400-e29b-41d4-a716-446655440013', 'UNIT', 'Unit', 'Đơn vị đo số lượng', '{"hisCode": "UNIT", "externalSystem": "LIS", "conversionFactor": 1}')
        `);

        await queryRunner.query(`
            INSERT INTO BMM_UNIT_OF_MEASURES (ID, UNIT_OF_MEASURE_CODE, UNIT_OF_MEASURE_NAME, DESCRIPTION, MAPPING) VALUES 
            ('550e8400-e29b-41d4-a716-446655440014', 'G', 'Gram', 'Đơn vị đo khối lượng', '{"hisCode": "G", "externalSystem": "LIS", "conversionFactor": 1000}')
        `);

        await queryRunner.query(`
            INSERT INTO BMM_UNIT_OF_MEASURES (ID, UNIT_OF_MEASURE_CODE, UNIT_OF_MEASURE_NAME, DESCRIPTION, MAPPING) VALUES 
            ('550e8400-e29b-41d4-a716-446655440015', 'L', 'Liter', 'Đơn vị đo thể tích chất lỏng', '{"hisCode": "L", "externalSystem": "LIS", "conversionFactor": 1000}')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop table
        await queryRunner.query(`DROP TABLE BMM_UNIT_OF_MEASURES CASCADE CONSTRAINTS`);
    }
}
