-- =====================================================================
-- Bai 4 (Buoi 4, Muc XII) - Migration 002
-- Bo sung cot note VARCHAR(200) (NULLable) cho bang enrollment_events
-- =====================================================================

BEGIN;

ALTER TABLE enrollment_events
    ADD COLUMN note VARCHAR(200);

INSERT INTO schema_migrations (version, description)
VALUES ('002', 'Add note column to enrollment_events');

COMMIT;

-- Truy van kiem tra sau khi ap dung migration 002:
SELECT version, description, applied_at
FROM schema_migrations
ORDER BY version;

SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'enrollment_events'
ORDER BY ordinal_position;

SELECT COUNT(*) AS total_events
FROM enrollment_events;
