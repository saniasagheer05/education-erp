-- =====================================================================
-- SVCE ERP - Seed Data
-- College: Sri Venkateshwara College of Engineering
-- =====================================================================
-- Run this AFTER schema.sql.
-- Usage: psql -U postgres -d svce_erp -f database/seed.sql
--
-- Default passwords (already bcrypt-hashed below, 10 salt rounds):
--   All students: Student@123
--   All admins:   Admin@123
-- =====================================================================

-- =====================================================================
-- Admins
-- =====================================================================
INSERT INTO admins (name, email, password_hash, role) VALUES
('Dr. Sarah Jenkins', 'admin@svce.edu.in', '$2b$10$h.La9xJ7JzwVu1N5drbnC.S7i.ibLvU.ahQyJlDA1bcBvEBjVEU82', 'super_admin'),
('Registrar Office', 'registrar@svce.edu.in', '$2b$10$h.La9xJ7JzwVu1N5drbnC.S7i.ibLvU.ahQyJlDA1bcBvEBjVEU82', 'admin');

-- =====================================================================
-- Students
-- (password_hash below corresponds to plaintext: Student@123)
-- =====================================================================
INSERT INTO students
(library_id, usn, first_name, middle_name, last_name, email, phone, password_hash,
 gender, date_of_birth, department, program, semester, section, academic_year, admission_type, status)
VALUES
('LIB-8821', '1MS20CS001', 'Aditi', NULL, 'Agarwal', 'aditi.agarwal@svce.edu.in', '9876543210',
 '$2b$10$D/RFzpY8r9J2PdUxwMCU6uV9GoMZjEsIKYWXNiT5.aM6XvZjGMBFC',
 'Female', '2002-04-12', 'Computer Science (CSE)', 'B.E.', 7, 'A', '2023-24', 'Regular', 'Active'),

('LIB-8845', '1MS20CS042', 'Rohan', NULL, 'Verma', 'rohan.verma@svce.edu.in', '9876543211',
 '$2b$10$D/RFzpY8r9J2PdUxwMCU6uV9GoMZjEsIKYWXNiT5.aM6XvZjGMBFC',
 'Male', '2002-01-25', 'Computer Science (CSE)', 'B.E.', 7, 'B', '2023-24', 'Regular', 'Active'),

('LIB-8902', '1MS21ME015', 'Sanya', NULL, 'Malhotra', 'sanya.malhotra@svce.edu.in', '9876543212',
 '$2b$10$D/RFzpY8r9J2PdUxwMCU6uV9GoMZjEsIKYWXNiT5.aM6XvZjGMBFC',
 'Female', '2003-06-30', 'Mechanical', 'B.E.', 5, 'A', '2023-24', 'Regular', 'Active'),

('LIB-9120', '1MS21CS112', 'Zoya', NULL, 'Pasha', 'zoya.pasha@svce.edu.in', '9876543213',
 '$2b$10$D/RFzpY8r9J2PdUxwMCU6uV9GoMZjEsIKYWXNiT5.aM6XvZjGMBFC',
 'Female', '2003-09-18', 'Computer Science (CSE)', 'B.E.', 5, 'B', '2023-24', 'Regular', 'Active'),

('LIB-9201', '1MS22EC012', 'Priya', NULL, 'Sharma', 'priya.sharma@svce.edu.in', '9876543214',
 '$2b$10$D/RFzpY8r9J2PdUxwMCU6uV9GoMZjEsIKYWXNiT5.aM6XvZjGMBFC',
 'Female', '2004-02-08', 'Electronics (ECE)', 'B.E.', 3, 'C', '2023-24', 'Regular', 'Active');

-- =====================================================================
-- Attendance
-- Sample attendance records across the last week for each student
-- =====================================================================
INSERT INTO attendance (student_id, subject, attendance_date, status) VALUES
-- Aditi Agarwal (student_id = 1)
(1, 'Data Structures', CURRENT_DATE - INTERVAL '4 days', 'Present'),
(1, 'Data Structures', CURRENT_DATE - INTERVAL '3 days', 'Present'),
(1, 'Operating Systems', CURRENT_DATE - INTERVAL '3 days', 'Absent'),
(1, 'Computer Networks', CURRENT_DATE - INTERVAL '2 days', 'Present'),
(1, 'Database Systems', CURRENT_DATE - INTERVAL '1 day', 'Present'),

-- Rohan Verma (student_id = 2)
(2, 'Data Structures', CURRENT_DATE - INTERVAL '4 days', 'Present'),
(2, 'Operating Systems', CURRENT_DATE - INTERVAL '3 days', 'Present'),
(2, 'Computer Networks', CURRENT_DATE - INTERVAL '2 days', 'Late'),
(2, 'Database Systems', CURRENT_DATE - INTERVAL '1 day', 'Absent'),

-- Sanya Malhotra (student_id = 3)
(3, 'Thermodynamics', CURRENT_DATE - INTERVAL '4 days', 'Present'),
(3, 'Fluid Mechanics', CURRENT_DATE - INTERVAL '3 days', 'Present'),
(3, 'Machine Design', CURRENT_DATE - INTERVAL '2 days', 'Present'),
(3, 'Manufacturing Technology', CURRENT_DATE - INTERVAL '1 day', 'Excused'),

-- Zoya Pasha (student_id = 4)
(4, 'Operating Systems', CURRENT_DATE - INTERVAL '4 days', 'Present'),
(4, 'Computer Networks', CURRENT_DATE - INTERVAL '3 days', 'Present'),
(4, 'Software Engineering', CURRENT_DATE - INTERVAL '2 days', 'Present'),
(4, 'Database Systems', CURRENT_DATE - INTERVAL '1 day', 'Present'),

-- Priya Sharma (student_id = 5)
(5, 'Digital Electronics', CURRENT_DATE - INTERVAL '4 days', 'Absent'),
(5, 'Signals and Systems', CURRENT_DATE - INTERVAL '3 days', 'Present'),
(5, 'Analog Circuits', CURRENT_DATE - INTERVAL '2 days', 'Present'),
(5, 'Electromagnetic Theory', CURRENT_DATE - INTERVAL '1 day', 'Present');

-- =====================================================================
-- Fees
-- =====================================================================
INSERT INTO fees (student_id, semester, academic_year, total_amount, paid_amount, due_date, status) VALUES
(1, 7, '2023-24', 85000.00, 85000.00, '2026-01-15', 'Paid'),
(2, 7, '2023-24', 85000.00, 40000.00, '2026-01-15', 'Partially Paid'),
(3, 5, '2023-24', 78000.00, 78000.00, '2025-12-01', 'Paid'),
(4, 5, '2023-24', 82000.00, 0.00, '2025-11-20', 'Overdue'),
(5, 3, '2023-24', 76000.00, 76000.00, '2026-02-01', 'Paid');

-- =====================================================================
-- Timetable
-- Shared per department + semester + section (Monday - Friday shown)
-- =====================================================================

-- CSE, Semester 7, Section A (covers Aditi Agarwal)
INSERT INTO timetable (department, semester, section, day_of_week, period_number, subject, faculty_name, start_time, end_time, room_number) VALUES
('Computer Science (CSE)', 7, 'A', 'Monday', 1, 'Data Structures', 'Dr. Meera Iyer', '09:00', '10:00', 'CS-101'),
('Computer Science (CSE)', 7, 'A', 'Monday', 2, 'Operating Systems', 'Prof. Anil Kumar', '10:00', '11:00', 'CS-102'),
('Computer Science (CSE)', 7, 'A', 'Tuesday', 1, 'Computer Networks', 'Dr. Ramesh Rao', '09:00', '10:00', 'CS-101'),
('Computer Science (CSE)', 7, 'A', 'Wednesday', 1, 'Database Systems', 'Prof. Kavita Nair', '09:00', '10:00', 'CS-103'),
('Computer Science (CSE)', 7, 'A', 'Thursday', 1, 'Software Engineering', 'Dr. Meera Iyer', '09:00', '10:00', 'CS-101'),
('Computer Science (CSE)', 7, 'A', 'Friday', 1, 'Data Structures Lab', 'Dr. Meera Iyer', '09:00', '11:00', 'CS-Lab-1');

-- CSE, Semester 7, Section B (covers Rohan Verma)
INSERT INTO timetable (department, semester, section, day_of_week, period_number, subject, faculty_name, start_time, end_time, room_number) VALUES
('Computer Science (CSE)', 7, 'B', 'Monday', 1, 'Data Structures', 'Dr. Meera Iyer', '09:00', '10:00', 'CS-201'),
('Computer Science (CSE)', 7, 'B', 'Monday', 2, 'Operating Systems', 'Prof. Anil Kumar', '10:00', '11:00', 'CS-202'),
('Computer Science (CSE)', 7, 'B', 'Tuesday', 1, 'Computer Networks', 'Dr. Ramesh Rao', '09:00', '10:00', 'CS-201'),
('Computer Science (CSE)', 7, 'B', 'Wednesday', 1, 'Database Systems', 'Prof. Kavita Nair', '09:00', '10:00', 'CS-203');

-- Mechanical, Semester 5, Section A (covers Sanya Malhotra)
INSERT INTO timetable (department, semester, section, day_of_week, period_number, subject, faculty_name, start_time, end_time, room_number) VALUES
('Mechanical', 5, 'A', 'Monday', 1, 'Thermodynamics', 'Dr. Suresh Babu', '09:00', '10:00', 'ME-101'),
('Mechanical', 5, 'A', 'Tuesday', 1, 'Fluid Mechanics', 'Prof. Lakshmi Menon', '09:00', '10:00', 'ME-102'),
('Mechanical', 5, 'A', 'Wednesday', 1, 'Machine Design', 'Dr. Suresh Babu', '09:00', '10:00', 'ME-101'),
('Mechanical', 5, 'A', 'Thursday', 1, 'Manufacturing Technology', 'Prof. Arvind Rao', '09:00', '10:00', 'ME-103');

-- CSE, Semester 5, Section B (covers Zoya Pasha)
INSERT INTO timetable (department, semester, section, day_of_week, period_number, subject, faculty_name, start_time, end_time, room_number) VALUES
('Computer Science (CSE)', 5, 'B', 'Monday', 1, 'Operating Systems', 'Prof. Anil Kumar', '09:00', '10:00', 'CS-301'),
('Computer Science (CSE)', 5, 'B', 'Tuesday', 1, 'Computer Networks', 'Dr. Ramesh Rao', '09:00', '10:00', 'CS-301'),
('Computer Science (CSE)', 5, 'B', 'Wednesday', 1, 'Software Engineering', 'Dr. Meera Iyer', '09:00', '10:00', 'CS-302'),
('Computer Science (CSE)', 5, 'B', 'Thursday', 1, 'Database Systems', 'Prof. Kavita Nair', '09:00', '10:00', 'CS-302');

-- Electronics (ECE), Semester 3, Section C (covers Priya Sharma)
INSERT INTO timetable (department, semester, section, day_of_week, period_number, subject, faculty_name, start_time, end_time, room_number) VALUES
('Electronics (ECE)', 3, 'C', 'Monday', 1, 'Digital Electronics', 'Dr. Nandini Rao', '09:00', '10:00', 'EC-101'),
('Electronics (ECE)', 3, 'C', 'Tuesday', 1, 'Signals and Systems', 'Prof. Vikram Shetty', '09:00', '10:00', 'EC-102'),
('Electronics (ECE)', 3, 'C', 'Wednesday', 1, 'Analog Circuits', 'Dr. Nandini Rao', '09:00', '10:00', 'EC-101'),
('Electronics (ECE)', 3, 'C', 'Thursday', 1, 'Electromagnetic Theory', 'Prof. Vikram Shetty', '09:00', '10:00', 'EC-103');
