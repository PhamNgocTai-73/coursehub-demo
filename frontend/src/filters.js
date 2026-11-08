// Buoi 5 - Bai 2: ham thuan ket hop 3 bo loc cua danh sach lop.
// courseCode === "" nghia la "Tat ca hoc phan".
export function filterSections(rows, { keyword, courseCode, onlyAvailable }) {
  const kw = keyword.trim().toLowerCase();
  return rows.filter((row) => (
    `${row.class_id} ${row.course_code} ${row.course_name}`.toLowerCase().includes(kw)
    && (courseCode === "" || row.course_code === courseCode)
    && (!onlyAvailable || row.remaining > 0)
  ));
}
