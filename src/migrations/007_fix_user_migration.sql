-- Migration: Fix User entity migration - handle unused columns properly
-- Date: 2025-10-10
-- Description: Fix Oracle unused columns issue and complete User entity migration

-- First, check if FULL_NAME column exists, if not add it
DECLARE
    column_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO column_exists
    FROM USER_TAB_COLUMNS 
    WHERE TABLE_NAME = 'BMM_USERS' AND COLUMN_NAME = 'FULL_NAME';
    
    IF column_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE BMM_USERS ADD FULL_NAME VARCHAR2(100)';
    END IF;
END;
/

-- Update existing data (concatenate firstName + lastName if they exist)
UPDATE BMM_USERS 
SET FULL_NAME = TRIM(FIRST_NAME || ' ' || LAST_NAME)
WHERE FIRST_NAME IS NOT NULL AND LAST_NAME IS NOT NULL
AND FULL_NAME IS NULL;

-- Make FULL_NAME NOT NULL after data migration
ALTER TABLE BMM_USERS MODIFY FULL_NAME NOT NULL;

-- Add new fields for location and department if they don't exist
DECLARE
    column_exists NUMBER;
BEGIN
    -- Check and add PROVINCE_ID
    SELECT COUNT(*) INTO column_exists
    FROM USER_TAB_COLUMNS 
    WHERE TABLE_NAME = 'BMM_USERS' AND COLUMN_NAME = 'PROVINCE_ID';
    
    IF column_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE BMM_USERS ADD PROVINCE_ID VARCHAR2(36)';
    END IF;
    
    -- Check and add WARD_ID
    SELECT COUNT(*) INTO column_exists
    FROM USER_TAB_COLUMNS 
    WHERE TABLE_NAME = 'BMM_USERS' AND COLUMN_NAME = 'WARD_ID';
    
    IF column_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE BMM_USERS ADD WARD_ID VARCHAR2(36)';
    END IF;
    
    -- Check and add DEPARTMENT_ID
    SELECT COUNT(*) INTO column_exists
    FROM USER_TAB_COLUMNS 
    WHERE TABLE_NAME = 'BMM_USERS' AND COLUMN_NAME = 'DEPARTMENT_ID';
    
    IF column_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE BMM_USERS ADD DEPARTMENT_ID VARCHAR2(36)';
    END IF;
END;
/

-- Add indexes for new fields (if they don't exist)
DECLARE
    index_exists NUMBER;
BEGIN
    -- Check and create FULL_NAME index
    SELECT COUNT(*) INTO index_exists
    FROM USER_INDEXES 
    WHERE INDEX_NAME = 'IDX_BMM_USERS_FULL_NAME';
    
    IF index_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE INDEX IDX_BMM_USERS_FULL_NAME ON BMM_USERS(FULL_NAME)';
    END IF;
    
    -- Check and create PROVINCE_ID index
    SELECT COUNT(*) INTO index_exists
    FROM USER_INDEXES 
    WHERE INDEX_NAME = 'IDX_BMM_USERS_PROVINCE_ID';
    
    IF index_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE INDEX IDX_BMM_USERS_PROVINCE_ID ON BMM_USERS(PROVINCE_ID)';
    END IF;
    
    -- Check and create WARD_ID index
    SELECT COUNT(*) INTO index_exists
    FROM USER_INDEXES 
    WHERE INDEX_NAME = 'IDX_BMM_USERS_WARD_ID';
    
    IF index_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE INDEX IDX_BMM_USERS_WARD_ID ON BMM_USERS(WARD_ID)';
    END IF;
    
    -- Check and create DEPARTMENT_ID index
    SELECT COUNT(*) INTO index_exists
    FROM USER_INDEXES 
    WHERE INDEX_NAME = 'IDX_BMM_USERS_DEPARTMENT_ID';
    
    IF index_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE INDEX IDX_BMM_USERS_DEPARTMENT_ID ON BMM_USERS(DEPARTMENT_ID)';
    END IF;
END;
/

-- Add foreign key constraints (if they don't exist)
DECLARE
    constraint_exists NUMBER;
BEGIN
    -- Check and add PROVINCE foreign key
    SELECT COUNT(*) INTO constraint_exists
    FROM USER_CONSTRAINTS 
    WHERE CONSTRAINT_NAME = 'FK_USER_PROVINCE';
    
    IF constraint_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE BMM_USERS ADD CONSTRAINT FK_USER_PROVINCE 
            FOREIGN KEY (PROVINCE_ID) REFERENCES BMM_PROVINCES(ID)';
    END IF;
    
    -- Check and add WARD foreign key
    SELECT COUNT(*) INTO constraint_exists
    FROM USER_CONSTRAINTS 
    WHERE CONSTRAINT_NAME = 'FK_USER_WARD';
    
    IF constraint_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE BMM_USERS ADD CONSTRAINT FK_USER_WARD 
            FOREIGN KEY (WARD_ID) REFERENCES BMM_WARDS(ID)';
    END IF;
    
    -- Check and add DEPARTMENT foreign key
    SELECT COUNT(*) INTO constraint_exists
    FROM USER_CONSTRAINTS 
    WHERE CONSTRAINT_NAME = 'FK_USER_DEPARTMENT';
    
    IF constraint_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE BMM_USERS ADD CONSTRAINT FK_USER_DEPARTMENT 
            FOREIGN KEY (DEPARTMENT_ID) REFERENCES BMM_DEPARTMENTS(ID)';
    END IF;
END;
/

-- Finally, drop unused columns properly
DECLARE
    column_exists NUMBER;
BEGIN
    -- Check if FIRST_NAME column exists and is unused
    SELECT COUNT(*) INTO column_exists
    FROM USER_TAB_COLUMNS 
    WHERE TABLE_NAME = 'BMM_USERS' AND COLUMN_NAME = 'FIRST_NAME';
    
    IF column_exists > 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE BMM_USERS SET UNUSED COLUMN FIRST_NAME';
    END IF;
    
    -- Check if LAST_NAME column exists and is unused
    SELECT COUNT(*) INTO column_exists
    FROM USER_TAB_COLUMNS 
    WHERE TABLE_NAME = 'BMM_USERS' AND COLUMN_NAME = 'LAST_NAME';
    
    IF column_exists > 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE BMM_USERS SET UNUSED COLUMN LAST_NAME';
    END IF;
END;
/

COMMIT;
