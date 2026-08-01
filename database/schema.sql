--
-- PostgreSQL database dump
--

\restrict goExdo05I2Zjh9I90yyWdBiMY80qrMCvwJaSIMoDfeNSfqf4LAtqErVbzjEcYsh

-- Dumped from database version 16.12
-- Dumped by pg_dump version 16.12

-- Started on 2026-08-02 01:18:07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4939 (class 0 OID 16914)
-- Dependencies: 216
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, name, email, password_hash, role, created_at, updated_at) FROM stdin;
2	Registrar Office	registrar@svce.edu.in	$2b$10$h.La9xJ7JzwVu1N5drbnC.S7i.ibLvU.ahQyJlDA1bcBvEBjVEU82	admin	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
1	Dr. Sarah Jenkins	admin@svce.edu.in	$2b$10$sZKwhVLKCsMX5AJZp5muNO1pAeQaXEyc6d4kNtTDP7YXRu3U3G6h2	super_admin	2026-07-30 16:58:45.876891	2026-08-01 14:38:35.91995
\.


--
-- TOC entry 4941 (class 0 OID 16928)
-- Dependencies: 218
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, library_id, usn, first_name, middle_name, last_name, email, phone, password_hash, gender, date_of_birth, department, program, semester, section, academic_year, admission_type, status, created_at, updated_at) FROM stdin;
1	LIB-8821	1MS20CS001	Aditi	\N	Agarwal	aditi.agarwal@svce.edu.in	9876543210	$2b$10$D/RFzpY8r9J2PdUxwMCU6uV9GoMZjEsIKYWXNiT5.aM6XvZjGMBFC	Female	2002-04-12	Computer Science (CSE)	B.E.	7	A	2023-24	Regular	Active	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
2	LIB-8845	1MS20CS042	Rohan	\N	Verma	rohan.verma@svce.edu.in	9876543211	$2b$10$D/RFzpY8r9J2PdUxwMCU6uV9GoMZjEsIKYWXNiT5.aM6XvZjGMBFC	Male	2002-01-25	Computer Science (CSE)	B.E.	7	B	2023-24	Regular	Active	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
3	LIB-8902	1MS21ME015	Sanya	\N	Malhotra	sanya.malhotra@svce.edu.in	9876543212	$2b$10$D/RFzpY8r9J2PdUxwMCU6uV9GoMZjEsIKYWXNiT5.aM6XvZjGMBFC	Female	2003-06-30	Mechanical	B.E.	5	A	2023-24	Regular	Active	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
4	LIB-9120	1MS21CS112	Zoya	\N	Pasha	zoya.pasha@svce.edu.in	9876543213	$2b$10$D/RFzpY8r9J2PdUxwMCU6uV9GoMZjEsIKYWXNiT5.aM6XvZjGMBFC	Female	2003-09-18	Computer Science (CSE)	B.E.	5	B	2023-24	Regular	Active	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
5	LIB-9201	1MS22EC012	Priya	\N	Sharma	priya.sharma@svce.edu.in	9876543214	$2b$10$D/RFzpY8r9J2PdUxwMCU6uV9GoMZjEsIKYWXNiT5.aM6XvZjGMBFC	Female	2004-02-08	Electronics (ECE)	B.E.	3	C	2023-24	Regular	Active	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
6	LIB-9999	\N	Test	\N	Student	test@svce.edu.in	\N	demo	\N	\N	Computer Science (CSE)	B.E.	3	A	2026-27	Regular	Active	2026-07-30 16:59:52.426143	2026-07-30 16:59:52.426143
7	23CS101	\N	Akash	\N	Singh	akashsingh@gmail.com	\N	$2b$10$nYzDeyTOW5r4Gv02tZ/ivex0joQbiLSbcGup0J0Gg54Fcj47jcyCm	\N	\N	Computer Science (CSE)	B.E.	1	A	2026-2027	Regular	Active	2026-08-01 14:50:14.890533	2026-08-01 14:50:14.890533
8	23CS100	\N	Aryan	\N	Kapoor	aryankapoor@gmail.com	\N	$2b$10$hjkmvzJjOi4vQuk1o3wdteoOrKku4B1tS8Df8HW6095uszYHI49le	\N	\N	Computer Science (CSE)	B.E.	1	A	2026-2027	Regular	Active	2026-08-01 14:56:36.854746	2026-08-01 14:56:36.854746
\.


--
-- TOC entry 4943 (class 0 OID 16951)
-- Dependencies: 220
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance (id, student_id, subject, attendance_date, status, marked_by, created_at, updated_at) FROM stdin;
1	1	Data Structures	2026-07-26	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
2	1	Data Structures	2026-07-27	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
3	1	Operating Systems	2026-07-27	Absent	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
4	1	Computer Networks	2026-07-28	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
5	1	Database Systems	2026-07-29	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
6	2	Data Structures	2026-07-26	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
7	2	Operating Systems	2026-07-27	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
8	2	Computer Networks	2026-07-28	Late	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
9	2	Database Systems	2026-07-29	Absent	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
10	3	Thermodynamics	2026-07-26	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
11	3	Fluid Mechanics	2026-07-27	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
12	3	Machine Design	2026-07-28	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
13	3	Manufacturing Technology	2026-07-29	Excused	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
14	4	Operating Systems	2026-07-26	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
15	4	Computer Networks	2026-07-27	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
16	4	Software Engineering	2026-07-28	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
17	4	Database Systems	2026-07-29	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
18	5	Digital Electronics	2026-07-26	Absent	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
19	5	Signals and Systems	2026-07-27	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
20	5	Analog Circuits	2026-07-28	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
21	5	Electromagnetic Theory	2026-07-29	Present	\N	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
\.


--
-- TOC entry 4945 (class 0 OID 16975)
-- Dependencies: 222
-- Data for Name: fees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fees (id, student_id, semester, academic_year, total_amount, paid_amount, due_date, status, created_at, updated_at) FROM stdin;
1	1	7	2023-24	85000.00	85000.00	2026-01-15	Paid	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
2	2	7	2023-24	85000.00	40000.00	2026-01-15	Partially Paid	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
3	3	5	2023-24	78000.00	78000.00	2025-12-01	Paid	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
4	4	5	2023-24	82000.00	0.00	2025-11-20	Overdue	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
5	5	3	2023-24	76000.00	76000.00	2026-02-01	Paid	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
\.


--
-- TOC entry 4947 (class 0 OID 16999)
-- Dependencies: 224
-- Data for Name: timetable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.timetable (id, department, semester, section, day_of_week, period_number, subject, faculty_name, start_time, end_time, room_number, created_at, updated_at) FROM stdin;
1	Computer Science (CSE)	7	A	Monday	1	Data Structures	Dr. Meera Iyer	09:00:00	10:00:00	CS-101	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
2	Computer Science (CSE)	7	A	Monday	2	Operating Systems	Prof. Anil Kumar	10:00:00	11:00:00	CS-102	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
3	Computer Science (CSE)	7	A	Tuesday	1	Computer Networks	Dr. Ramesh Rao	09:00:00	10:00:00	CS-101	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
4	Computer Science (CSE)	7	A	Wednesday	1	Database Systems	Prof. Kavita Nair	09:00:00	10:00:00	CS-103	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
5	Computer Science (CSE)	7	A	Thursday	1	Software Engineering	Dr. Meera Iyer	09:00:00	10:00:00	CS-101	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
6	Computer Science (CSE)	7	A	Friday	1	Data Structures Lab	Dr. Meera Iyer	09:00:00	11:00:00	CS-Lab-1	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
7	Computer Science (CSE)	7	B	Monday	1	Data Structures	Dr. Meera Iyer	09:00:00	10:00:00	CS-201	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
8	Computer Science (CSE)	7	B	Monday	2	Operating Systems	Prof. Anil Kumar	10:00:00	11:00:00	CS-202	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
9	Computer Science (CSE)	7	B	Tuesday	1	Computer Networks	Dr. Ramesh Rao	09:00:00	10:00:00	CS-201	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
10	Computer Science (CSE)	7	B	Wednesday	1	Database Systems	Prof. Kavita Nair	09:00:00	10:00:00	CS-203	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
11	Mechanical	5	A	Monday	1	Thermodynamics	Dr. Suresh Babu	09:00:00	10:00:00	ME-101	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
12	Mechanical	5	A	Tuesday	1	Fluid Mechanics	Prof. Lakshmi Menon	09:00:00	10:00:00	ME-102	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
13	Mechanical	5	A	Wednesday	1	Machine Design	Dr. Suresh Babu	09:00:00	10:00:00	ME-101	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
14	Mechanical	5	A	Thursday	1	Manufacturing Technology	Prof. Arvind Rao	09:00:00	10:00:00	ME-103	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
15	Computer Science (CSE)	5	B	Monday	1	Operating Systems	Prof. Anil Kumar	09:00:00	10:00:00	CS-301	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
16	Computer Science (CSE)	5	B	Tuesday	1	Computer Networks	Dr. Ramesh Rao	09:00:00	10:00:00	CS-301	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
17	Computer Science (CSE)	5	B	Wednesday	1	Software Engineering	Dr. Meera Iyer	09:00:00	10:00:00	CS-302	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
18	Computer Science (CSE)	5	B	Thursday	1	Database Systems	Prof. Kavita Nair	09:00:00	10:00:00	CS-302	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
19	Electronics (ECE)	3	C	Monday	1	Digital Electronics	Dr. Nandini Rao	09:00:00	10:00:00	EC-101	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
20	Electronics (ECE)	3	C	Tuesday	1	Signals and Systems	Prof. Vikram Shetty	09:00:00	10:00:00	EC-102	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
21	Electronics (ECE)	3	C	Wednesday	1	Analog Circuits	Dr. Nandini Rao	09:00:00	10:00:00	EC-101	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
22	Electronics (ECE)	3	C	Thursday	1	Electromagnetic Theory	Prof. Vikram Shetty	09:00:00	10:00:00	EC-103	2026-07-30 16:58:45.876891	2026-07-30 16:58:45.876891
\.


--
-- TOC entry 4953 (class 0 OID 0)
-- Dependencies: 215
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 2, true);


--
-- TOC entry 4954 (class 0 OID 0)
-- Dependencies: 219
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_id_seq', 21, true);


--
-- TOC entry 4955 (class 0 OID 0)
-- Dependencies: 221
-- Name: fees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fees_id_seq', 5, true);


--
-- TOC entry 4956 (class 0 OID 0)
-- Dependencies: 217
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 8, true);


--
-- TOC entry 4957 (class 0 OID 0)
-- Dependencies: 223
-- Name: timetable_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.timetable_id_seq', 22, true);


-- Completed on 2026-08-02 01:18:07

--
-- PostgreSQL database dump complete
--

\unrestrict goExdo05I2Zjh9I90yyWdBiMY80qrMCvwJaSIMoDfeNSfqf4LAtqErVbzjEcYsh

