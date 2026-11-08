// Buoi 5 - Bai 3: lich su dang ky/huy cua sinh vien, phan trang phia server.
// Chi tai EVENT_PAGE_SIZE dong moi lan (skip/limit); Backend loc dataset='demo'.
import { useEffect, useState } from "react";
import { api } from "../api.js";
import { buildEventsPath, hasNextPage, EVENT_PAGE_SIZE } from "../events.js";
import Notice from "./Notice.jsx";

const LABELS = { CREATED: "Đăng ký", CANCELLED: "Hủy đăng ký" };

export default function EventHistory({ studentId, refresh }) {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Doi sinh vien -> ve trang dau (set trong cung su kien render, truoc effect).
  const [shownStudent, setShownStudent] = useState(studentId);
  if (shownStudent !== studentId) {
    setShownStudent(studentId);
    setPage(0);
  }

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await api(buildEventsPath(studentId, page),
          { signal: controller.signal });
        if (controller.signal.aborted) return;
        setRows(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err.message);
        setRows([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [studentId, page, refresh]);

  return (
    <section className="panel">
      <h2>4. Lịch sử đăng ký</h2>
      <p className="muted">Sinh viên {studentId} · trang {page + 1}
        {" "}(mỗi trang {EVENT_PAGE_SIZE} sự kiện, mới nhất trước)</p>
      <Notice kind="error">{error}</Notice>
      {loading && <Notice>Đang tải lịch sử...</Notice>}
      {!loading && !error && rows.length === 0 && (
        <p>{page === 0 ? "Chưa có sự kiện nào." : "Không còn sự kiện ở trang này."}</p>
      )}
      {!error && rows.length > 0 && (
        <ul className="enrollments" aria-label="Lịch sử đăng ký">
          {rows.map((row) => (
            <li key={row.id}>
              <div>
                <strong>{LABELS[row.event_type] ?? row.event_type}</strong>
                {" "}{row.class_section_id}
                <span className="subtext">
                  {new Date(row.occurred_at).toLocaleString("vi-VN")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="filters">
        <button type="button" className="secondary"
          disabled={loading || page === 0}
          onClick={() => setPage((p) => p - 1)}>Trang trước</button>
        <button type="button" className="secondary"
          disabled={loading || !hasNextPage(rows)}
          onClick={() => setPage((p) => p + 1)}>Trang sau</button>
      </div>
    </section>
  );
}
