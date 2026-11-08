# CourseHub - Buoi 5

## Cach chay (hai Terminal)

- Terminal 1 (thu muc goc coursehub-demo): `python -m uvicorn backend.app.main:app --reload`
- Terminal 2: `cd frontend`, `npm install` (lan dau), `npm run dev` -> http://127.0.0.1:5173/
- Sao chep `frontend/.env.example` thanh `frontend/.env.local` (khong commit).
- Kiem tra: `npm test` va `npm run build`.

## Ban phac Figma

- Link Figma: (dan link vao day sau khi ve xong)

## Ket qua quan sat (chay thuc te, 2026-11-08)

- GET /health: 200 `{"status":"ok","database":"connected"}`.
- Truoc: WEB-01 capacity 3, enrolled 2, remaining 1; 22000004 chua dang ky lop nao; migration 001 co.
- POST /enrollments (22000004, WEB-01): 201; POST lan 2: 409 "Sinh vien da dang ky lop nay".
- Sau POST: WEB-01 enrolled 3, remaining 0; enrollments co (22000004, WEB-01); su kien CREATED moi.
- DELETE /enrollments/22000004/WEB-01: 204, khong co body.
- Sau DELETE: WEB-01 enrolled 2, remaining 1; cap dang ky bi xoa; them su kien CANCELLED, CREATED cu van con.
- GET /students/99999999/enrollments: 404 `{"detail":"Khong tim thay sinh vien"}`.
- `npm test`: 12/12 pass; `npm run build`: thanh cong (35 modules).

## Ghi chu CORS

- Origin = giao thuc + ten may + cong. `127.0.0.1:5173` va `localhost:5173` la hai origin khac nhau; ca hai deu nam trong `allow_origins`.
- Preflight `OPTIONS /enrollments` tu Origin `http://127.0.0.1:5173`: 200 kem `access-control-allow-origin`.
- Origin `http://localhost:3000`: 400 "Disallowed CORS origin", khong co `access-control-allow-origin`.
- CORS khong phai dang nhap, cung khong thay the khoa dong cua Buoi 4. Khong dung `mode: "no-cors"`.
