# CourseHub - Buoi 5

## Cach chay (hai Terminal)

- Terminal 1 (thu muc goc coursehub-demo): `python -m uvicorn backend.app.main:app --reload`
- Terminal 2: `cd frontend`, `npm install` (lan dau), `npm run dev` -> http://127.0.0.1:5173/
- Sao chep `frontend/.env.example` thanh `frontend/.env.local` (khong commit).
- Kiem tra: `npm test` va `npm run build`.

## Ban phac Figma

- Link Design & Frame goc (1280px): https://www.figma.com/design/1z91zPSsZIyrCXIxrsPg6r/CourseHub-%E2%80%93-Bu%E1%BB%95i-5?node-id=2-2
- Link Code Layer 3 trang thai (Ban phac chuan, Dang ky WEB-01 thanh cong 201, Lop RACE-01 het cho 409): https://www.figma.com/design/1z91zPSsZIyrCXIxrsPg6r/CourseHub-%E2%80%93-Bu%E1%BB%95i-5?node-id=5-3
- File vector SVG trong `docs/`:
  - `docs/figma_state2_dang_ky_thanh_cong.svg`
  - `docs/figma_state3_lop_het_cho_409.svg`

## Ket qua quan sat (chay thuc te, 2026-11-08)

- GET /health: 200 `{"status":"ok","database":"connected"}`.
- Truoc: WEB-01 capacity 3, enrolled 2, remaining 1; 22000004 chua dang ky lop nao; migration 001 co.
- POST /enrollments (22000004, WEB-01): 201; POST lan 2: 409 "Sinh vien da dang ky lop nay".
- Sau POST: WEB-01 enrolled 3, remaining 0; enrollments co (22000004, WEB-01); su kien CREATED moi (id 100002, dataset = demo).
- DELETE /enrollments/22000004/WEB-01: 204, khong co body.
- Sau DELETE: WEB-01 enrolled 2, remaining 1; cap dang ky bi xoa; them su kien CANCELLED (id 100003), CREATED cu van con.
- Thu hai cua so RACE-01 (capacity = 1): Cua so A (22000002) nhan 201 Created, Cua so B (22000004) nhan 409 "Lop hoc phan da het cho"; sau do huy dang ky RACE-01 cua 22000002 (204) de tra remaining = 1.
- GET /students/99999999/enrollments: 404 `{"detail":"Khong tim thay sinh vien"}`.
- `npm test`: pass; `npm run build`: thanh cong.

## Ghi chu CORS

- Origin = giao thuc + ten may + cong. `127.0.0.1:5173` va `localhost:5173` la hai origin khac nhau; ca hai deu nam trong `allow_origins`.
- Preflight `OPTIONS /enrollments` tu Origin `http://127.0.0.1:5173`: 200 kem `access-control-allow-origin`.
- Origin `http://localhost:3000`: 400 "Disallowed CORS origin", khong co `access-control-allow-origin`.
- CORS khong phai dang nhap, cung khong thay the khoa dong cua Buoi 4. Khong dung `mode: "no-cors"`.

## Bai tap tu thuc hanh (Muc XV.2 - Bai 1-4)

- **Bai 1 (`StudentForm.jsx`)**: Tach form chon sinh vien ra component rieng, nhan `draftId`, `onDraftChange`, `onSubmit`, `onRefresh`, `busy`, `loading`, `studentId` qua props; `App.jsx` giu state duy nhat (single source of truth).
- **Bai 2 (`filters.js` & `<select>` hoc phan)**: Bo sung bo loc hoc phan lay danh sach dong tu `GET /courses` (`INT2204`, `INT2205`, `INT2206`), ket hop AND voi tu khoa va `onlyAvailable`.
- **Bai 3 (`GET /enrollment-events`, `events.js`, `EventHistory.jsx`)**: Bo sung endpoint phan trang lich su dang ky/huy (`dataset = 'demo'`, `skip`, `limit` 1..100, `ORDER BY occurred_at DESC, id DESC`) va giao dien phan trang 10 su kien/trang voi `AbortController`.
- **Bai 4 (Tim kiem/phan trang phia server cho Project nhom)**:
  - Tham so truy van: `q` (tu khoa, `min_length=1`), `skip` (`ge=0`), `limit` (`ge=1, le=100`, mac dinh 20), cung cac bo loc nghiep vu; truyen qua bind parameters (khong noi chuoi SQL).
  - Thu tu sap xep on dinh (stable sort): luon `ORDER BY <cot_nghiep_vu> DESC, id DESC` (co tie-breaker duy nhat `id`) de khong bi trung hoac sot dong giua cac trang.
