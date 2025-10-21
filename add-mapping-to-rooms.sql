-- Add MAPPING field to BMM_ROOMS table
-- Date: 2025-10-21
-- Description: Add mapping field for HIS integration and external system mapping

-- Add MAPPING column to BMM_ROOMS table
ALTER TABLE BMM_ROOMS 
ADD MAPPING VARCHAR2(500);

-- Add comment to describe the column
COMMENT ON COLUMN BMM_ROOMS.MAPPING IS 'Mapping information for HIS integration and external systems (JSON format)';

-- Create index for better query performance on mapping field
CREATE INDEX IDX_BMM_ROOMS_MAPPING ON BMM_ROOMS(MAPPING);

-- Optional: Update existing rooms with sample mapping data
-- Uncomment the following lines if you want to add sample mapping data

/*
-- Sample mapping data for existing rooms
UPDATE BMM_ROOMS 
SET MAPPING = '{"hisCode": "ROOM001", "externalSystem": "HIS", "roomType": "EXAMINATION", "floor": "2", "building": "A"}' 
WHERE ROOM_CODE = 'R001';

UPDATE BMM_ROOMS 
SET MAPPING = '{"hisCode": "ROOM002", "externalSystem": "HIS", "roomType": "SURGERY", "floor": "3", "building": "B"}' 
WHERE ROOM_CODE = 'R002';

UPDATE BMM_ROOMS 
SET MAPPING = '{"hisCode": "ROOM003", "externalSystem": "HIS", "roomType": "LABORATORY", "floor": "1", "building": "C"}' 
WHERE ROOM_CODE = 'R003';
*/

-- Verify the column was added successfully
SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, NULLABLE 
FROM USER_TAB_COLUMNS 
WHERE TABLE_NAME = 'BMM_ROOMS' 
AND COLUMN_NAME = 'MAPPING';

-- Show table structure
DESC BMM_ROOMS;
