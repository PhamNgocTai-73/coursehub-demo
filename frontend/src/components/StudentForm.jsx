// Buoi 5 - Bai 1: tach form chon sinh vien tu App.jsx.
// StudentForm KHONG giu state sinh vien: App so huu draftId/studentId,
// form chi nhan gia tri (draftId) va ham xu ly (onDraftChange, onSubmit,
// onRefresh) qua props -> khong co ban sao state nao co the lech nhau.
export default function StudentForm({
  draftId, onDraftChange, onSubmit, onRefresh, busy, loading, studentId,
}) {
  return (
    <section className="panel">
      <h2>1. Chọn sinh viên</h2>
      <form className="student-form" onSubmit={onSubmit}>
        <label htmlFor="student-id">Mã sinh viên</label>
        <input id="student-id" value={draftId} maxLength={8} required
          inputMode="numeric" onChange={(e) => onDraftChange(e.target.value)}
          disabled={busy} />
        <button type="submit" disabled={busy}>Xem đăng ký</button>
        <button type="button" className="secondary" disabled={busy || loading}
          onClick={onRefresh}>Tải lại dữ liệu</button>
      </form>
      <p className="muted">Dữ liệu đang xem: <strong>{studentId}</strong>.
        Mã mẫu: 22000001–22000004.</p>
    </section>
  );
}
