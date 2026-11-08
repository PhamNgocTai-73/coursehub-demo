-- =====================================================================
-- Bai 4 (Buoi 4, Muc XII) - Rollback Migration 002
-- Luu y: Rollback nay XOA cot note, nen moi du lieu ghi chu da luu trong
-- cot note se BI MAT VINH VIEN. Cac cot khac va cac dong su kien van con.
-- =====================================================================

BEGIN;

ALTER TABLE enrollment_events
    DROP COLUMN note;

DELETE FROM schema_migrations
WHERE version = '002';

COMMIT;
