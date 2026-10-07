-- 1. Bang sinh vien
CREATE TABLE students (
    id VARCHAR(8) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    major VARCHAR(20) NOT NULL,
    email VARCHAR(120) NOT NULL,
    CONSTRAINT uq_students_email UNIQUE (email),
    CONSTRAINT ck_students_id CHECK (length(id) = 8),
    CONSTRAINT ck_students_name CHECK (trim(name) <> '')
);

-- 2. Bang hoc phan
CREATE TABLE courses (
    code VARCHAR(10) NOT NULL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    credits INTEGER NOT NULL,
    CONSTRAINT ck_courses_credits CHECK (credits BETWEEN 1 AND 6)
);

-- 3. Bang hoc ky
CREATE TABLE semesters (
    code VARCHAR(10) NOT NULL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    CONSTRAINT ck_semesters_dates CHECK (end_date >= start_date)
);

-- 4. Bang giang vien
CREATE TABLE lecturers (
    id VARCHAR(10) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 5. Bang lop hoc phan
CREATE TABLE class_sections (
    id VARCHAR(20) NOT NULL PRIMARY KEY,
    course_code VARCHAR(10) NOT NULL REFERENCES courses(code),
    semester_code VARCHAR(10) NOT NULL REFERENCES semesters(code),
    lecturer_id VARCHAR(10) NOT NULL REFERENCES lecturers(id),
    capacity INTEGER NOT NULL,
    CONSTRAINT ck_sections_capacity CHECK (capacity > 0)
);

-- 6. Bang dang ky
CREATE TABLE enrollments (
    student_id VARCHAR(8) NOT NULL REFERENCES students(id),
    class_section_id VARCHAR(20) NOT NULL REFERENCES class_sections(id),
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_enrollments PRIMARY KEY (student_id, class_section_id)
);