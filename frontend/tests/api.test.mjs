// Buoi 5 - Muc XIV.1: 8 tinh huong HTTP gia lap cho src/api.js (khong can Backend/PostgreSQL).
import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { api } from "../src/api.js";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function stubFetch(status, bodyText) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return new Response(status === 204 ? null : bodyText, { status });
  };
  return calls;
}

test("1. 200 JSON tra ve du lieu", async () => {
  const calls = stubFetch(200, JSON.stringify([{ class_id: "WEB-01" }]));
  const data = await api("/sections");
  assert.deepEqual(data, [{ class_id: "WEB-01" }]);
  assert.equal(calls[0].url, "http://127.0.0.1:8000/sections");
  assert.equal(calls[0].init.method, "GET");
});

test("2. 201 POST gui body JSON va Content-Type", async () => {
  const payload = { student_id: "22000004", class_section_id: "WEB-01" };
  const calls = stubFetch(201, JSON.stringify({ ok: true }));
  const data = await api("/enrollments", { method: "POST", body: payload });
  assert.deepEqual(data, { ok: true });
  assert.equal(calls[0].url, "http://127.0.0.1:8000/enrollments");
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.headers["Content-Type"], "application/json");
  assert.equal(calls[0].init.body, JSON.stringify(payload));
});

test("3. 204 tra ve null", async () => {
  stubFetch(204);
  const data = await api("/enrollments/22000004/WEB-01", { method: "DELETE" });
  assert.equal(data, null);
});

test("4. 404 detail chuoi -> Error 'HTTP 404: ...' co status", async () => {
  stubFetch(404, JSON.stringify({ detail: "Khong tim thay sinh vien" }));
  await assert.rejects(api("/students/99999999/enrollments"), (err) => {
    assert.equal(err.message, "HTTP 404: Khong tim thay sinh vien");
    assert.equal(err.status, 404);
    return true;
  });
});

test("5. 409 xung dot -> status 409 va thong bao", async () => {
  stubFetch(409, JSON.stringify({ detail: "Lop da het cho" }));
  await assert.rejects(
    api("/enrollments", { method: "POST", body: { student_id: "22000004", class_section_id: "RACE-01" } }),
    (err) => {
      assert.equal(err.status, 409);
      assert.equal(err.message, "HTTP 409: Lop da het cho");
      return true;
    },
  );
});

test("6. 422 detail dang mang -> msg noi bang '; '", async () => {
  stubFetch(422, JSON.stringify({ detail: [{ msg: "Field required" }, { msg: "Input should be a valid string" }] }));
  await assert.rejects(api("/enrollments", { method: "POST", body: {} }), (err) => {
    assert.equal(err.status, 422);
    assert.equal(err.message, "HTTP 422: Field required; Input should be a valid string");
    return true;
  });
});

test("7. body khong phai JSON -> thong bao 'phản hồi không phải JSON'", async () => {
  stubFetch(200, "<html>oops</html>");
  await assert.rejects(api("/sections"), (err) => {
    assert.match(err.message, /phản hồi không phải JSON/);
    assert.equal(err.message, "HTTP 200: phản hồi không phải JSON.");
    return true;
  });
});

test("8. loi mang -> thong bao than thien; AbortError giu nguyen", async () => {
  globalThis.fetch = async () => {
    throw new TypeError("fetch failed");
  };
  await assert.rejects(api("/sections"), (err) => {
    assert.match(err.message, /^Không nhận được phản hồi API\./);
    assert.equal(err.status, undefined);
    return true;
  });

  const abort = new DOMException("The operation was aborted.", "AbortError");
  globalThis.fetch = async () => {
    throw abort;
  };
  await assert.rejects(api("/sections"), (err) => {
    assert.equal(err, abort);
    assert.equal(err.name, "AbortError");
    return true;
  });
});
