# CourseHub - Buoi 4

- Migration 001: enrollment_events.
- Demo class: RACE-01, capacity = 1.
- POST /enrollments: lock class_sections bang FOR UPDATE.
- Concurrency test: 1 request 201, 1 request 409.
- Performance data: 100000 rows, dataset=performance.
- Index: idx_enrollment_events_dataset_student_time.
- Truoc index: Seq Scan + Sort (top-N heapsort), rows = 50 (Rows Removed by Filter = 99183), Buffers: shared hit = 1140, Planning Time = 0.806 ms, Execution Time = 11.099 ms.
- Sau index: Index Scan using idx_enrollment_events_dataset_student_time, rows = 50 (Index Searches = 1), Buffers: shared hit = 53, Planning Time = 4.183 ms, Execution Time = 0.462 ms.

Khong commit backend/.env.
