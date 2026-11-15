// Buoi 5 - Loi giai: kiem thu ham thuan cua Bai 2 va Bai 3 (khong can DOM/Backend).
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildEventsPath, hasNextPage } from "../src/events.js";
import { filterSections } from "../src/filters.js";

const rows = [
  { class_id: "WEB-01", course_code: "INT2204", course_name: "Lap trinh Web", remaining: 1 },
  { class_id: "WEB-02", course_code: "INT2204", course_name: "Lap trinh Web", remaining: 0 },
  { class_id: "DB-01", course_code: "INT2205", course_name: "Co so du lieu", remaining: 5 },
];

test("Bai 2: 'Tat ca' khong loc theo hoc phan", () => {
  const out = filterSections(rows, { keyword: "", courseCode: "", onlyAvailable: false });
  assert.equal(out.length, 3);
});

test("Bai 2: ket hop ma hoc phan + chi con cho + tu khoa", () => {
  const base = { keyword: "", courseCode: "INT2204", onlyAvailable: false };
  assert.deepEqual(filterSections(rows, base).map((r) => r.class_id), ["WEB-01", "WEB-02"]);
  assert.deepEqual(
    filterSections(rows, { ...base, onlyAvailable: true }).map((r) => r.class_id), ["WEB-01"]);
  assert.deepEqual(filterSections(rows, { ...base, keyword: "db" }), []);
});

test("Bai 3: buildEventsPath tinh skip theo trang va ma hoa tham so", () => {
  assert.equal(buildEventsPath("22000004", 0),
    "/enrollment-events?student_id=22000004&skip=0&limit=10");
  assert.equal(buildEventsPath("22000004", 2),
    "/enrollment-events?student_id=22000004&skip=20&limit=10");
  assert.match(buildEventsPath("a b&c", 0), /student_id=a\+b%26c/);
});

test("Bai 3: hasNextPage chi true khi trang day", () => {
  assert.equal(hasNextPage(new Array(10).fill({})), true);
  assert.equal(hasNextPage(new Array(3).fill({})), false);
});
