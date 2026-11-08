-- =====================================================================
-- Bai 3 (Buoi 4, Muc XII) - Chi muc thu hai theo nghiep vu
-- Truy van nghiep vu: Lay 50 su kien gan nhat cua mot lop hoc phan
-- (class_section_id = 'WEB-01') theo loai su kien (event_type = 'CREATED')
-- trong khoang thoi gian tu 2025-12-01 tro di.
--
-- Thiet ke thu tu cot trong Composite Index:
--   (dataset, class_section_id, event_type, occurred_at DESC)
-- Giai thich:
--   1. Cac cot so sanh bang (=): dataset, class_section_id, event_type
--      dat truoc de thu hep nhanh pham vi tim kiem trong B-Tree.
--   2. Cot loc khoang (>=) kiem sap xep (ORDER BY occurred_at DESC):
--      occurred_at DESC dat o cuoi de PostgreSQL doc luon theo thu tu
--      thoi gian giam dan ma khong can buoc Sort rieng.
-- =====================================================================

-- 1. Do truoc khi tao chi muc thu hai
DROP INDEX IF EXISTS idx_enrollment_events_dataset_section_type_time;
ANALYZE enrollment_events;

EXPLAIN (ANALYZE, BUFFERS)
SELECT id, student_id, class_section_id, event_type, occurred_at
FROM enrollment_events
WHERE dataset = 'performance'
  AND class_section_id = 'WEB-01'
  AND event_type = 'CREATED'
  AND occurred_at >= TIMESTAMP '2025-12-01 00:00:00'
ORDER BY occurred_at DESC
LIMIT 50;

-- 2. Tao composite index thu hai va cap nhat thong ke
CREATE INDEX idx_enrollment_events_dataset_section_type_time
ON enrollment_events (dataset, class_section_id, event_type, occurred_at DESC);

ANALYZE enrollment_events;

-- 3. Do sau khi tao chi muc thu hai
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, student_id, class_section_id, event_type, occurred_at
FROM enrollment_events
WHERE dataset = 'performance'
  AND class_section_id = 'WEB-01'
  AND event_type = 'CREATED'
  AND occurred_at >= TIMESTAMP '2025-12-01 00:00:00'
ORDER BY occurred_at DESC
LIMIT 50;
