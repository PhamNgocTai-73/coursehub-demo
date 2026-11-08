from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

from backend.app.database import engine


def main() -> None:
    """Bai 2 (Buoi 4 - Muc XII): Kiem thu rollback nhieu bang ngoai main production."""
    parameters = {
        "student_id": "22000004",
        "class_section_id": "WEB-01",
    }
    insert_sql = """
        INSERT INTO enrollments (student_id, class_section_id)
        VALUES (:student_id, :class_section_id)
    """
    bad_event_sql = """
        INSERT INTO enrollment_events
            (student_id, class_section_id, event_type, source, dataset)
        VALUES
            (:student_id, :class_section_id, 'KHONG_HOP_LE', 'demo', 'demo')
    """
    check_sql = """
        SELECT 1
        FROM enrollments
        WHERE student_id = :student_id
          AND class_section_id = :class_section_id
    """

    with engine.connect() as conn:
        before_count = conn.execute(text("SELECT COUNT(*) FROM enrollments")).scalar_one()

    rolled_back = False
    try:
        with engine.begin() as conn:
            conn.execute(text(insert_sql), parameters)
            conn.execute(text(bad_event_sql), parameters)
    except IntegrityError as exc:
        rolled_back = True
        print("IntegrityError (mong doi):", str(exc.orig).strip())

    with engine.connect() as conn:
        after_count = conn.execute(text("SELECT COUNT(*) FROM enrollments")).scalar_one()
        still_there = conn.execute(text(check_sql), parameters).first()

    assert rolled_back is True
    assert still_there is None
    assert before_count == after_count
    print(f"PASS: Transaction da rollback. enrollments truoc={before_count}, sau={after_count}.")


if __name__ == "__main__":
    main()
