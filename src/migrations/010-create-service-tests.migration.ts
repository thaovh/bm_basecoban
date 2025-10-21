import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServiceTests1700000010 implements MigrationInterface {
    name = 'CreateServiceTests1700000010';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE BMM_SERVICE_TESTS (
        ID VARCHAR2(36) PRIMARY KEY,
        TEST_CODE VARCHAR2(50) NOT NULL,
        TEST_NAME VARCHAR2(200) NOT NULL,
        SHORT_NAME VARCHAR2(50) NOT NULL,
        SERVICE_ID VARCHAR2(36) NOT NULL,
        UNIT_OF_MEASURE_ID VARCHAR2(36) NOT NULL,
        RANGE_TEXT VARCHAR2(500),
        RANGE_LOW NUMBER,
        RANGE_HIGH NUMBER,
        MAPPING VARCHAR2(500),
        TEST_ORDER NUMBER DEFAULT 0 NOT NULL,
        IS_ACTIVE_FLAG NUMBER DEFAULT 1 NOT NULL,
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        DELETED_AT TIMESTAMP,
        CREATED_BY VARCHAR2(50),
        UPDATED_BY VARCHAR2(50),
        VERSION NUMBER DEFAULT 1 NOT NULL
      )
    `);

        // Add unique constraint
        await queryRunner.query(`ALTER TABLE BMM_SERVICE_TESTS ADD CONSTRAINT UK_SERVICE_TEST_CODE UNIQUE (TEST_CODE)`);

        // Add foreign key constraints
        await queryRunner.query(`
      ALTER TABLE BMM_SERVICE_TESTS 
      ADD CONSTRAINT FK_BMM_SERVICE_TESTS_BMM_SERVICES 
      FOREIGN KEY (SERVICE_ID) 
      REFERENCES BMM_SERVICES(ID)
    `);

        await queryRunner.query(`
      ALTER TABLE BMM_SERVICE_TESTS 
      ADD CONSTRAINT FK_BMM_SERVICE_TESTS_BMM_UNIT_OF_MEASURES 
      FOREIGN KEY (UNIT_OF_MEASURE_ID) 
      REFERENCES BMM_UNIT_OF_MEASURES(ID)
    `);

        // Add indexes
        await queryRunner.query(`CREATE INDEX IDX_BMM_SERVICE_TESTS_CODE ON BMM_SERVICE_TESTS(TEST_CODE)`);
        await queryRunner.query(`CREATE INDEX IDX_BMM_SERVICE_TESTS_NAME ON BMM_SERVICE_TESTS(TEST_NAME)`);
        await queryRunner.query(`CREATE INDEX IDX_BMM_SERVICE_TESTS_SHORT_NAME ON BMM_SERVICE_TESTS(SHORT_NAME)`);
        await queryRunner.query(`CREATE INDEX IDX_BMM_SERVICE_TESTS_SERVICE_ID ON BMM_SERVICE_TESTS(SERVICE_ID)`);
        await queryRunner.query(`CREATE INDEX IDX_BMM_SERVICE_TESTS_UNIT_OF_MEASURE_ID ON BMM_SERVICE_TESTS(UNIT_OF_MEASURE_ID)`);
        await queryRunner.query(`CREATE INDEX IDX_BMM_SERVICE_TESTS_IS_ACTIVE_FLAG ON BMM_SERVICE_TESTS(IS_ACTIVE_FLAG)`);
        await queryRunner.query(`CREATE INDEX IDX_BMM_SERVICE_TESTS_TEST_ORDER ON BMM_SERVICE_TESTS(TEST_ORDER)`);

        // Insert sample data
        await queryRunner.query(`
      INSERT INTO BMM_SERVICE_TESTS (
        ID, TEST_CODE, TEST_NAME, SHORT_NAME, SERVICE_ID, UNIT_OF_MEASURE_ID, 
        RANGE_TEXT, RANGE_LOW, RANGE_HIGH, MAPPING, TEST_ORDER, 
        IS_ACTIVE_FLAG, CREATED_BY, UPDATED_BY
      ) VALUES (
        '123e4567-e89b-12d3-a456-426614174001', 
        'TEST_001', 
        'Xét nghiệm máu tổng quát', 
        'XN Máu TQ', 
        '123e4567-e89b-12d3-a456-426614174001',
        '2862cd01-5a13-4404-be5c-2b537c9d0e12',
        'Bình thường: 3.5-5.5 g/dL',
        3.5,
        5.5,
        '{"hisCode": "TEST001", "externalSystem": "LIS"}',
        1,
        1,
        'system',
        'system'
      )
    `);

        await queryRunner.query(`
      INSERT INTO BMM_SERVICE_TESTS (
        ID, TEST_CODE, TEST_NAME, SHORT_NAME, SERVICE_ID, UNIT_OF_MEASURE_ID, 
        RANGE_TEXT, RANGE_LOW, RANGE_HIGH, MAPPING, TEST_ORDER, 
        IS_ACTIVE_FLAG, CREATED_BY, UPDATED_BY
      ) VALUES (
        '123e4567-e89b-12d3-a456-426614174002', 
        'TEST_002', 
        'Xét nghiệm đường huyết', 
        'XN Đường huyết', 
        '123e4567-e89b-12d3-a456-426614174001',
        '2862cd01-5a13-4404-be5c-2b537c9d0e12',
        'Bình thường: 70-100 mg/dL',
        70,
        100,
        '{"hisCode": "TEST002", "externalSystem": "LIS"}',
        2,
        1,
        'system',
        'system'
      )
    `);

        await queryRunner.query(`
      INSERT INTO BMM_SERVICE_TESTS (
        ID, TEST_CODE, TEST_NAME, SHORT_NAME, SERVICE_ID, UNIT_OF_MEASURE_ID, 
        RANGE_TEXT, RANGE_LOW, RANGE_HIGH, MAPPING, TEST_ORDER, 
        IS_ACTIVE_FLAG, CREATED_BY, UPDATED_BY
      ) VALUES (
        '123e4567-e89b-12d3-a456-426614174003', 
        'TEST_003', 
        'Xét nghiệm cholesterol', 
        'XN Cholesterol', 
        '123e4567-e89b-12d3-a456-426614174001',
        '2862cd01-5a13-4404-be5c-2b537c9d0e12',
        'Bình thường: <200 mg/dL',
        0,
        200,
        '{"hisCode": "TEST003", "externalSystem": "LIS"}',
        3,
        1,
        'system',
        'system'
      )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE BMM_SERVICE_TESTS`);
    }
}
