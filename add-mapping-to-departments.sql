-- Add MAPPING field to BMM_DEPARTMENTS table
-- Date: 2025-10-21
-- Description: Add mapping field for HIS integration and external system mapping

-- Add MAPPING column to BMM_DEPARTMENTS table
ALTER TABLE BMM_DEPARTMENTS 
ADD MAPPING VARCHAR2(500);

-- Add comment to describe the column
COMMENT ON COLUMN BMM_DEPARTMENTS.MAPPING IS 'Mapping information for HIS integration and external systems (JSON format)';

-- Create index for better query performance on mapping field
CREATE INDEX IDX_BMM_DEPARTMENTS_MAPPING ON BMM_DEPARTMENTS(MAPPING);

-- Optional: Update existing departments with sample mapping data
-- Uncomment the following lines if you want to add sample mapping data

/*
-- Sample mapping data for existing departments
UPDATE BMM_DEPARTMENTS 
SET MAPPING = '{"hisCode": "DEPT001", "externalSystem": "HIS", "departmentType": "MEDICAL"}' 
WHERE DEPARTMENT_CODE = 'MED001';

UPDATE BMM_DEPARTMENTS 
SET MAPPING = '{"hisCode": "DEPT002", "externalSystem": "HIS", "departmentType": "SURGICAL"}' 
WHERE DEPARTMENT_CODE = 'SURG001';

UPDATE BMM_DEPARTMENTS 
SET MAPPING = '{"hisCode": "DEPT003", "externalSystem": "HIS", "departmentType": "LABORATORY"}' 
WHERE DEPARTMENT_CODE = 'LAB001';
*/

-- Verify the column was added successfully
SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, NULLABLE 
FROM USER_TAB_COLUMNS 
WHERE TABLE_NAME = 'BMM_DEPARTMENTS' 
AND COLUMN_NAME = 'MAPPING';

-- Show table structure
DESC BMM_DEPARTMENTS;
