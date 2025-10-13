import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServicesMigration011 implements MigrationInterface {
    name = 'CreateServicesMigration011';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create BMM_SERVICES table
        await queryRunner.query(`
            CREATE TABLE BMM_SERVICES (
                ID VARCHAR2(36) NOT NULL,
                SERVICE_CODE VARCHAR2(50) NOT NULL,
                SERVICE_NAME VARCHAR2(200) NOT NULL,
                SHORT_NAME VARCHAR2(50) NOT NULL,
                SERVICE_GROUP_ID VARCHAR2(36) NOT NULL,
                UNIT_OF_MEASURE_ID VARCHAR2(36) NOT NULL,
                MAPPING VARCHAR2(500),
                NUM_ORDER NUMBER DEFAULT 0,
                CURRENT_PRICE NUMBER(10,2),
                PARENT_SERVICE_ID VARCHAR2(36),
                IS_ACTIVE NUMBER DEFAULT 1,
                CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                DELETED_AT TIMESTAMP NULL,
                CREATED_BY VARCHAR2(50),
                UPDATED_BY VARCHAR2(50),
                VERSION NUMBER DEFAULT 1,
                CONSTRAINT PK_BMM_SERVICES PRIMARY KEY (ID)
            )
        `);

        // Create BMM_SERVICE_PRICE_HISTORY table
        await queryRunner.query(`
            CREATE TABLE BMM_SERVICE_PRICE_HISTORY (
                ID VARCHAR2(36) NOT NULL,
                SERVICE_ID VARCHAR2(36) NOT NULL,
                PRICE NUMBER(10,2) NOT NULL,
                EFFECTIVE_FROM TIMESTAMP NOT NULL,
                EFFECTIVE_TO TIMESTAMP NULL,
                REASON VARCHAR2(500),
                CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                DELETED_AT TIMESTAMP NULL,
                CREATED_BY VARCHAR2(50),
                UPDATED_BY VARCHAR2(50),
                VERSION NUMBER DEFAULT 1,
                CONSTRAINT PK_BMM_SERVICE_PRICE_HISTORY PRIMARY KEY (ID)
            )
        `);

        // Create unique constraints
        await queryRunner.query(`
            ALTER TABLE BMM_SERVICES ADD CONSTRAINT UK_SERVICE_CODE UNIQUE (SERVICE_CODE)
        `);

        // Create foreign key constraints
        await queryRunner.query(`
            ALTER TABLE BMM_SERVICES ADD CONSTRAINT FK_SERVICE_SERVICE_GROUP 
            FOREIGN KEY (SERVICE_GROUP_ID) REFERENCES BMM_SERVICE_GROUPS(ID)
        `);

        await queryRunner.query(`
            ALTER TABLE BMM_SERVICES ADD CONSTRAINT FK_SERVICE_UNIT_OF_MEASURE 
            FOREIGN KEY (UNIT_OF_MEASURE_ID) REFERENCES BMM_UNIT_OF_MEASURES(ID)
        `);

        await queryRunner.query(`
            ALTER TABLE BMM_SERVICES ADD CONSTRAINT FK_SERVICE_PARENT_SERVICE 
            FOREIGN KEY (PARENT_SERVICE_ID) REFERENCES BMM_SERVICES(ID)
        `);

        await queryRunner.query(`
            ALTER TABLE BMM_SERVICE_PRICE_HISTORY ADD CONSTRAINT FK_SERVICE_PRICE_HISTORY_SERVICE 
            FOREIGN KEY (SERVICE_ID) REFERENCES BMM_SERVICES(ID)
        `);

        // Insert sample data
        await queryRunner.query(`
            INSERT INTO BMM_SERVICES (
                ID, SERVICE_CODE, SERVICE_NAME, SHORT_NAME, 
                SERVICE_GROUP_ID, UNIT_OF_MEASURE_ID, MAPPING, 
                NUM_ORDER, CURRENT_PRICE, IS_ACTIVE
            ) VALUES (
                SYS_GUID(), 'LAB_001', 'Xét nghiệm máu tổng quát', 'XN Máu TQ',
                (SELECT ID FROM BMM_SERVICE_GROUPS WHERE SERVICE_GROUP_CODE = 'LAB' AND ROWNUM = 1),
                (SELECT ID FROM BMM_UNIT_OF_MEASURES WHERE UNIT_OF_MEASURE_CODE = 'UNIT' AND ROWNUM = 1),
                '{"hisCode": "LAB001", "externalSystem": "LIS"}',
                1, 150000.00, 1
            )
        `);

        await queryRunner.query(`
            INSERT INTO BMM_SERVICES (
                ID, SERVICE_CODE, SERVICE_NAME, SHORT_NAME, 
                SERVICE_GROUP_ID, UNIT_OF_MEASURE_ID, MAPPING, 
                NUM_ORDER, CURRENT_PRICE, IS_ACTIVE
            ) VALUES (
                SYS_GUID(), 'LAB_002', 'Xét nghiệm sinh hóa máu', 'XN SH Máu',
                (SELECT ID FROM BMM_SERVICE_GROUPS WHERE SERVICE_GROUP_CODE = 'LAB' AND ROWNUM = 1),
                (SELECT ID FROM BMM_UNIT_OF_MEASURES WHERE UNIT_OF_MEASURE_CODE = 'UNIT' AND ROWNUM = 1),
                '{"hisCode": "LAB002", "externalSystem": "LIS"}',
                2, 200000.00, 1
            )
        `);

        await queryRunner.query(`
            INSERT INTO BMM_SERVICES (
                ID, SERVICE_CODE, SERVICE_NAME, SHORT_NAME, 
                SERVICE_GROUP_ID, UNIT_OF_MEASURE_ID, MAPPING, 
                NUM_ORDER, CURRENT_PRICE, IS_ACTIVE
            ) VALUES (
                SYS_GUID(), 'IMG_001', 'Chụp X-quang ngực thẳng', 'XQ Ngực T',
                (SELECT ID FROM BMM_SERVICE_GROUPS WHERE SERVICE_GROUP_CODE = 'IMG' AND ROWNUM = 1),
                (SELECT ID FROM BMM_UNIT_OF_MEASURES WHERE UNIT_OF_MEASURE_CODE = 'UNIT' AND ROWNUM = 1),
                '{"hisCode": "IMG001", "externalSystem": "PACS"}',
                1, 300000.00, 1
            )
        `);

        // Insert sample price history
        await queryRunner.query(`
            INSERT INTO BMM_SERVICE_PRICE_HISTORY (
                ID, SERVICE_ID, PRICE, EFFECTIVE_FROM, EFFECTIVE_TO, REASON
            ) VALUES (
                SYS_GUID(),
                (SELECT ID FROM BMM_SERVICES WHERE SERVICE_CODE = 'LAB_001' AND ROWNUM = 1),
                120000.00,
                TO_DATE('2024-01-01 00:00:00', 'YYYY-MM-DD HH24:MI:SS'),
                TO_DATE('2024-06-30 23:59:59', 'YYYY-MM-DD HH24:MI:SS'),
                'Giá cũ'
            )
        `);

        await queryRunner.query(`
            INSERT INTO BMM_SERVICE_PRICE_HISTORY (
                ID, SERVICE_ID, PRICE, EFFECTIVE_FROM, EFFECTIVE_TO, REASON
            ) VALUES (
                SYS_GUID(),
                (SELECT ID FROM BMM_SERVICES WHERE SERVICE_CODE = 'LAB_001' AND ROWNUM = 1),
                150000.00,
                TO_DATE('2024-07-01 00:00:00', 'YYYY-MM-DD HH24:MI:SS'),
                NULL,
                'Tăng giá theo quy định mới'
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.query(`
            ALTER TABLE BMM_SERVICE_PRICE_HISTORY DROP CONSTRAINT FK_SERVICE_PRICE_HISTORY_SERVICE
        `);

        await queryRunner.query(`
            ALTER TABLE BMM_SERVICES DROP CONSTRAINT FK_SERVICE_PARENT_SERVICE
        `);

        await queryRunner.query(`
            ALTER TABLE BMM_SERVICES DROP CONSTRAINT FK_SERVICE_UNIT_OF_MEASURE
        `);

        await queryRunner.query(`
            ALTER TABLE BMM_SERVICES DROP CONSTRAINT FK_SERVICE_SERVICE_GROUP
        `);

        // Drop unique constraints
        await queryRunner.query(`
            ALTER TABLE BMM_SERVICES DROP CONSTRAINT UK_SERVICE_CODE
        `);

        // Drop tables
        await queryRunner.query(`
            DROP TABLE BMM_SERVICE_PRICE_HISTORY
        `);

        await queryRunner.query(`
            DROP TABLE BMM_SERVICES
        `);
    }
}
