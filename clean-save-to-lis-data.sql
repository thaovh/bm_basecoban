-- ============================================
-- CLEAN DATA SCRIPT FOR SAVE-TO-LIS WORKFLOW
-- ============================================
-- Date: 2025-10-23
-- Description: Clean all data related to save-to-lis functionality
-- ============================================

-- ⚠️ WARNING: This will delete ALL data in these tables
-- ⚠️ Make sure to backup before running this script

-- ============================================
-- 1. CLEAN CORE TABLES (in dependency order)
-- ============================================

-- Delete Result Trackings first (has FK to Service Requests)
DELETE FROM BMM_RESULT_TRACKINGS;
COMMIT;

-- Delete Service Request Item Tests (has FK to Service Request Items)
DELETE FROM BMM_SR_ITEM_TESTS;
COMMIT;

-- Delete Service Request Items (has FK to Service Requests)
DELETE FROM BMM_SERVICE_REQ_ITEMS;
COMMIT;

-- Delete Service Requests (main table)
DELETE FROM BMM_SERVICE_REQUESTS;
COMMIT;

-- Delete Patients (created by save-to-lis)
DELETE FROM BMM_PATIENTS;
COMMIT;

-- ============================================
-- 2. CLEAN REFERENCE DATA (optional)
-- ============================================

-- Uncomment these if you want to clean reference data too
-- DELETE FROM BMM_SERVICES;
-- DELETE FROM BMM_SERVICE_TESTS;
-- DELETE FROM BMM_SERVICE_GROUPS;
-- DELETE FROM BMM_UNIT_OF_MEASURES;
-- DELETE FROM BMM_RESULT_STATUSES;
-- DELETE FROM BMM_ROOMS;
-- DELETE FROM BMM_SAMPLE_TYPES;
-- DELETE FROM BMM_PROVINCES;
-- DELETE FROM BMM_WARDS;
-- COMMIT;

-- ============================================
-- 3. RESET SEQUENCES (if using auto-increment)
-- ============================================

-- Note: Oracle doesn't use sequences for UUIDs, but if you have any
-- numeric sequences, reset them here

-- ============================================
-- 4. VERIFY CLEANUP
-- ============================================

-- Check counts after cleanup
SELECT 'BMM_SERVICE_REQUESTS' as TABLE_NAME, COUNT(*) as RECORD_COUNT FROM BMM_SERVICE_REQUESTS
UNION ALL
SELECT 'BMM_SERVICE_REQ_ITEMS', COUNT(*) FROM BMM_SERVICE_REQ_ITEMS
UNION ALL
SELECT 'BMM_SR_ITEM_TESTS', COUNT(*) FROM BMM_SR_ITEM_TESTS
UNION ALL
SELECT 'BMM_RESULT_TRACKINGS', COUNT(*) FROM BMM_RESULT_TRACKINGS
UNION ALL
SELECT 'BMM_PATIENTS', COUNT(*) FROM BMM_PATIENTS
UNION ALL
SELECT 'BMM_SERVICES', COUNT(*) FROM BMM_SERVICES
UNION ALL
SELECT 'BMM_SERVICE_TESTS', COUNT(*) FROM BMM_SERVICE_TESTS
UNION ALL
SELECT 'BMM_SERVICE_GROUPS', COUNT(*) FROM BMM_SERVICE_GROUPS
UNION ALL
SELECT 'BMM_UNIT_OF_MEASURES', COUNT(*) FROM BMM_UNIT_OF_MEASURES
UNION ALL
SELECT 'BMM_RESULT_STATUSES', COUNT(*) FROM BMM_RESULT_STATUSES
UNION ALL
SELECT 'BMM_ROOMS', COUNT(*) FROM BMM_ROOMS
UNION ALL
SELECT 'BMM_SAMPLE_TYPES', COUNT(*) FROM BMM_SAMPLE_TYPES
UNION ALL
SELECT 'BMM_PROVINCES', COUNT(*) FROM BMM_PROVINCES
UNION ALL
SELECT 'BMM_WARDS', COUNT(*) FROM BMM_WARDS;

-- ============================================
-- 5. REINSERT REFERENCE DATA (if needed)
-- ============================================

-- If you cleaned reference data, you may need to reinsert it
-- Run your migration scripts or insert statements here

PRINT 'Cleanup completed successfully!';
