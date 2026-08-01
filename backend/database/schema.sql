-- =====================================================================
-- SVCE ERP - PostgreSQL Database Schema
-- College: Sri Venkateshwara College of Engineering
-- =====================================================================
-- Run this file first to create all tables, constraints, and indexes.
-- Usage: psql -U postgres -d svce_erp -f database/schema.sql
-- =====================================================================

-- Drop tables if they already exist (in correct dependency order)
DROP TABLE IF EXISTS timetable CASCADE;
DROP TABLE IF EXISTS fees CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- =====================================================================
-- Table: admins
-- Stores administrator / registrar accounts that manage the ERP.
-- =====================================================================
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- Table: students
-- Stores core student records. library_id is the login identifier
-- (USN may be pending at admission time, so it is nullable/unique when set).
-- =====================================================================
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    library_id VARCHAR(50) UNIQUE NOT NULL,
    usn VARCHAR(20) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    gender VARCHAR(20),
    date_of_birth DATE,
    department VARCHAR(100) NOT NULL,
    program VARCHAR(50) NOT NULL DEFAULT 'B.E.',
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    section VARCHAR(5) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    admission_type VARCHAR(50) NOT NULL DEFAULT 'Regular',
    status VARCHAR(30) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_students_department ON students(department);
CREATE INDEX idx_students_semester_section ON students(semester, section);

-- =====================================================================
-- Table: attendance
-- One row per student per subject per date.
-- =====================================================================
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(150) NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
    marked_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, subject, attendance_date)
);

CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);

-- =====================================================================
-- Table: fees
-- Fee record per student per semester.
-- =====================================================================
CREATE TABLE fees (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    academic_year VARCHAR(20) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    due_amount NUMERIC(10, 2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    due_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Partially Paid', 'Overdue')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, semester, academic_year)
);

CREATE INDEX idx_fees_student_id ON fees(student_id);
CREATE INDEX idx_fees_status ON fees(status);

-- =====================================================================
-- Table: timetable
-- Class schedule keyed by department + semester + section + day.
-- A student's timetable is resolved by matching their department,
-- semester, and section against this table.
-- =====================================================================
CREATE TABLE timetable (
    id SERIAL PRIMARY KEY,
    department VARCHAR(100) NOT NULL,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    section VARCHAR(5) NOT NULL,
    day_of_week VARCHAR(15) NOT NULL CHECK (
        day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
    ),
    period_number INTEGER NOT NULL CHECK (period_number BETWEEN 1 AND 8),
    subject VARCHAR(150) NOT NULL,
    faculty_name VARCHAR(150) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (department, semester, section, day_of_week, period_number)
);

CREATE INDEX idx_timetable_lookup ON timetable(department, semester, section);

-- =====================================================================
-- Trigger function: automatically bump updated_at on row updates
-- =====================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_attendance_updated_at BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_fees_updated_at BEFORE UPDATE ON fees
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_timetable_updated_at BEFORE UPDATE ON timetable
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
