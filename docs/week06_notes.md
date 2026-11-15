# Buổi 6 - Docker, Testing, CI

## Môi trường
- OS: Windows
- Docker version: Docker 29.2.1, Docker Compose v5.0.2
- Python / Node version: Python 3.13.9 (local `.venv`), Python 3.12 (Dockerfile & CI) / Node v24.21.0 (local), Node 22.12.0 (Dockerfile & CI)

## Kết quả local
- `python -m pytest backend/tests -q`: 2 passed in 1.39s
- `npm test`: 12 passed, 0 failed
- `npm run build`: built in 667ms (`dist/` generated)
- `docker compose up -d --build`: thành công (chạy với `DOCKER_BUILDKIT=0`, `COMPOSE_BAKE=false` do đường dẫn có ký tự Unicode `OneDrive\Tài liệu`); `backend-1` trạng thái `healthy`, `frontend-1` đang chạy cổng `8080:80`

## Một luồng tích hợp đã kiểm tra
- Request:
  - `GET http://127.0.0.1:8080/`
  - `GET http://127.0.0.1:8000/health` và `GET http://127.0.0.1:8080/api/health`
  - `GET http://127.0.0.1:8080/api/sections`
  - `POST http://127.0.0.1:8080/api/enrollments` (`22000004`, `WEB-02`), `DELETE http://127.0.0.1:8080/api/enrollments/22000004/WEB-02`, `POST` trùng lớp và `POST` sinh viên `99999999`
- HTTP status: `GET /` `200`, `/health` `200` (`{"status":"ok","database":"connected"}`), `POST` hợp lệ `201`, `DELETE` `204`, `POST` trùng `409`, `POST` không tìm thấy sinh viên `404`
- SQL xác nhận: log `backend-1` ghi nhận request từ Nginx (`172.19.0.3`) và dữ liệu trả về từ PostgreSQL trên host qua `host.docker.internal:5432`

## Debug / AI
- Lỗi gặp phải:
  1. `pytest.exe` báo `ModuleNotFoundError: No module named 'backend'` khi chạy trực tiếp; dùng `python -m pytest backend/tests -q` thì pass.
  2. Docker BuildKit báo `unable to prepare context: path "...\OneDrive\Tài liệu\..." not found` do đường dẫn Unicode trên Windows; chạy với `$env:DOCKER_BUILDKIT='0'; $env:COMPOSE_BAKE='false'` thì build và chạy bình thường.
- Bằng chứng đã xem: output `docker compose ps`, `docker compose logs --tail=8 backend`, response HTTP từ `127.0.0.1:8080` và `127.0.0.1:8000`.
- Nếu dùng AI: dùng `python -m pytest` và truyền biến môi trường mẫu không chứa secret trong job `backend` của `.github/workflows/ci.yml` để `backend/app/database.py` không báo thiếu biến môi trường trên runner CI.

## Pull Request / CI
- PR:
- Reviewer:
- CI run:
