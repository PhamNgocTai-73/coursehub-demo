// Buoi 5 - Bai 3: ham thuan (khong DOM) de tao URL lich su - de kiem thu.
export const EVENT_PAGE_SIZE = 10;

export function buildEventsPath(studentId, page, pageSize = EVENT_PAGE_SIZE) {
  const params = new URLSearchParams({
    student_id: studentId,
    skip: String(page * pageSize),
    limit: String(pageSize),
  });
  return `/enrollment-events?${params}`;
}

// Neu trang tra ve it hon pageSize dong thi chac chan khong con trang sau.
export function hasNextPage(rows, pageSize = EVENT_PAGE_SIZE) {
  return rows.length >= pageSize;
}
