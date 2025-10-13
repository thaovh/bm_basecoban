import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServiceGroups1700000009 implements MigrationInterface {
    name = 'CreateServiceGroups1700000009';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create BMM_SERVICE_GROUPS table
        await queryRunner.query(`
            CREATE TABLE BMM_SERVICE_GROUPS (
                ID VARCHAR2(36) PRIMARY KEY,
                SERVICE_GROUP_CODE VARCHAR2(50) NOT NULL,
                SERVICE_GROUP_NAME VARCHAR2(200) NOT NULL,
                SHORT_NAME VARCHAR2(50) NOT NULL,
                MAPPING VARCHAR2(500),
                CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                DELETED_AT TIMESTAMP,
                CREATED_BY VARCHAR2(50),
                UPDATED_BY VARCHAR2(50),
                VERSION NUMBER DEFAULT 1 NOT NULL
            )
        `);

        // Add unique constraint with shorter name
        await queryRunner.query(`ALTER TABLE BMM_SERVICE_GROUPS ADD CONSTRAINT UK_SVC_GRP_CODE UNIQUE (SERVICE_GROUP_CODE)`);

        // Create indexes
        await queryRunner.query(`CREATE INDEX IDX_BMM_SERVICE_GROUPS_CODE ON BMM_SERVICE_GROUPS(SERVICE_GROUP_CODE)`);
        await queryRunner.query(`CREATE INDEX IDX_BMM_SERVICE_GROUPS_NAME ON BMM_SERVICE_GROUPS(SERVICE_GROUP_NAME)`);
        await queryRunner.query(`CREATE INDEX IDX_BMM_SERVICE_GROUPS_SHORT_NAME ON BMM_SERVICE_GROUPS(SHORT_NAME)`);
        await queryRunner.query(`CREATE INDEX IDX_BMM_SERVICE_GROUPS_CREATED_AT ON BMM_SERVICE_GROUPS(CREATED_AT)`);

        // Insert sample data
        await queryRunner.query(`
            INSERT INTO BMM_SERVICE_GROUPS (ID, SERVICE_GROUP_CODE, SERVICE_GROUP_NAME, SHORT_NAME, MAPPING) VALUES 
            ('550e8400-e29b-41d4-a716-446655440001', 'LAB_001', 'Laboratory Services', 'LAB', '{"hisCode": "LAB001", "externalSystem": "LIS"}')
        `);

        await queryRunner.query(`
            INSERT INTO BMM_SERVICE_GROUPS (ID, SERVICE_GROUP_CODE, SERVICE_GROUP_NAME, SHORT_NAME, MAPPING) VALUES 
            ('550e8400-e29b-41d4-a716-446655440002', 'RAD_001', 'Radiology Services', 'RAD', '{"hisCode": "RAD001", "externalSystem": "RIS"}')
        `);

        await queryRunner.query(`
            INSERT INTO BMM_SERVICE_GROUPS (ID, SERVICE_GROUP_CODE, SERVICE_GROUP_NAME, SHORT_NAME, MAPPING) VALUES 
            ('550e8400-e29b-41d4-a716-446655440003', 'PHARM_001', 'Pharmacy Services', 'PHARM', '{"hisCode": "PHARM001", "externalSystem": "PIS"}')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop table
        await queryRunner.query(`DROP TABLE BMM_SERVICE_GROUPS CASCADE CONSTRAINTS`);
    }
}
