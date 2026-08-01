# SVCE ERP — Backend API

A production-style REST API and PostgreSQL database powering **SVCE ERP**, a college
management system built for **Sri Venkateshwara College of Engineering**. It handles
student and admin authentication, student profiles, attendance, fee tracking, and
class timetables — designed to be consumed by the companion React Native (Expo)
frontend.

> Built as a full-stack portfolio project: Node.js/Express REST API + PostgreSQL,
> JWT auth, bcrypt password hashing, role-based access control, and a clean
> layered architecture (routes → controllers → models → database).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Clone & Install](#2-clone--install)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Create the PostgreSQL Database](#4-create-the-postgresql-database)
  - [5. Run the Schema and Seed Data](#5-run-the-schema-and-seed-data)
  - [6. Start the Server](#6-start-the-server)
- [API Endpoints](#api-endpoints)
- [Example Requests](#example-requests)
- [Connecting from React Native (Expo)](#connecting-from-react-native-expo)
- [Default Seed Credentials](#default-seed-credentials)
- [Error Handling & Validation](#error-handling--validation)
- [Screenshots](#screenshots)
- [License](#license)

---

## Features

- 🔐 **Dual authentication** — students log in with Library ID + password, admins
  log in with email + password. Both return a signed JWT.
- 🧑‍🎓 **Student self-service API** — profile, attendance (with per-subject
  percentage summary), fee status, and weekly timetable.
- 🛠️ **Admin management API** — register students, update student records, mark
  attendance, manage fee records, and manage class timetables.
- 🗄️ **Relational PostgreSQL schema** — proper foreign keys, `CHECK` constraints,
  unique constraints, auto-updating `updated_at` triggers, and a generated
  `due_amount` column on fees.
- 🛡️ **Role-based access control** middleware (`requireAdmin`, `requireStudent`).
- ✅ **Request validation** on every write endpoint, with descriptive error arrays.
- 🚨 **Centralized error handling**, including translated PostgreSQL error codes
  (unique violation, foreign key violation, check violation) into clean HTTP
  responses.
- 📦 Realistic seed data: 5 students, 2 admins, attendance, fees, and timetables
  across 4 departments.

---

## Tech Stack

| Layer          | Technology                     |
|----------------|---------------------------------|
| Runtime        | Node.js (v18+)                 |
| Framework      | Express.js                     |
| Database       | PostgreSQL                     |
| DB Driver      | `pg` (node-postgres)            |
| Auth           | JSON Web Tokens (`jsonwebtoken`)|
| Password Hash  | `bcrypt`                        |
| Config         | `dotenv`                        |
| CORS           | `cors`                          |

---

## Project Structure

```
backend/
├── package.json
├── package-lock.json
├── server.js                  # App entry point
├── .env.example                # Environment variable template
├── .gitignore
├── config/
│   └── db.js                   # PostgreSQL connection pool
├── middleware/
│   ├── auth.js                 # JWT verification + role guards
│   └── errorHandler.js         # Centralized error + 404 handling
├── controllers/
│   ├── authController.js       # Student & admin login
│   ├── studentController.js    # Student self-service endpoints
│   └── adminController.js      # Admin management endpoints
├── routes/
│   ├── authRoutes.js
│   ├── studentRoutes.js
│   └── adminRoutes.js
├── models/
│   ├── Student.js               # All SQL queries for students
│   ├── Admin.js                 # All SQL queries for admins
│   ├── Attendance.js            # All SQL queries for attendance
│   ├── Fee.js                   # All SQL queries for fees
│   └── Timetable.js             # All SQL queries for timetable
├── utils/
│   ├── generateToken.js         # JWT signing helper
│   ├── asyncHandler.js          # Async route wrapper (no repetitive try/catch)
│   └── validators.js            # Request payload validation helpers
└── database/
    ├── schema.sql                # Full DDL: tables, constraints, triggers
    └── seed.sql                  # Sample data (5 students, 2 admins, etc.)
```

---

## Database Schema

Five tables, related as follows:

```
admins ─────────────┐
                     │ (marked_by, optional)
students ── 1:N ──▶ attendance
students ── 1:N ──▶ fees

students.(department, semester, section)
        matches
timetable.(department, semester, section)   ── N:1 (resolved at query time)
```

- **students** — `library_id` (unique login id) and `usn` (nullable/unique — may be
  assigned later in the admission workflow).
- **attendance** — one row per student/subject/date, `UNIQUE(student_id, subject, attendance_date)`.
- **fees** — one row per student/semester/academic_year, with `due_amount` as a
  PostgreSQL **generated column** (`total_amount - paid_amount`).
- **timetable** — keyed by `(department, semester, section, day_of_week, period_number)`;
  a student's personal timetable is resolved by matching their own department/
  semester/section against this table.

See [`database/schema.sql`](./database/schema.sql) for the full DDL, including
`CHECK` constraints, indexes, and `updated_at` triggers.

---

## Getting Started

### 1. Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** v13 or higher, running locally or accessible remotely
- **npm**

### 2. Clone & Install

```bash
git clone https://github.com/<your-username>/svce-erp-backend.git
cd svce-erp-backend/backend
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=svce_erp
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d

CORS_ORIGIN=*
```

### 4. Create the PostgreSQL Database

```bash
# Log in to psql
psql -U postgres

# Inside the psql shell:
CREATE DATABASE svce_erp;
\q
```

Or, in one line from your terminal:

```bash
psql -U postgres -c "CREATE DATABASE svce_erp;"
```

### 5. Run the Schema and Seed Data

From the `backend/` directory:

```bash
psql -U postgres -d svce_erp -f database/schema.sql
psql -U postgres -d svce_erp -f database/seed.sql
```

This creates all 5 tables and inserts:
- 2 admin accounts
- 5 student accounts (across CSE, Mechanical, and ECE)
- Sample attendance, fee, and timetable records

### 6. Start the Server

```bash
npm start
```

You should see:

```
PostgreSQL connected successfully at ...
SVCE ERP backend running on http://localhost:5000
Environment: development
```

Verify it's alive:

```bash
curl http://localhost:5000/api/health
```

For development with auto-restart on file changes:

```bash
npm run dev
```

---

## API Endpoints

### Auth (public)

| Method | Endpoint                    | Description               |
|--------|------------------------------|----------------------------|
| POST   | `/api/auth/student/login`   | Student login (Library ID + password) |
| POST   | `/api/auth/admin/login`     | Admin login (email + password) |

### Student (requires `Authorization: Bearer <student_token>`)

| Method | Endpoint                    | Description                          |
|--------|------------------------------|----------------------------------------|
| GET    | `/api/student/profile`      | Get the logged-in student's profile   |
| GET    | `/api/student/attendance`   | Get attendance records + subject-wise % summary |
| GET    | `/api/student/fees`         | Get fee records for all semesters     |
| GET    | `/api/student/timetable`    | Get the student's weekly class timetable |

### Admin (requires `Authorization: Bearer <admin_token>`)

| Method | Endpoint                        | Description                     |
|--------|-----------------------------------|-----------------------------------|
| POST   | `/api/admin/students`             | Register a new student          |
| GET    | `/api/admin/students`             | List all students (filterable)  |
| GET    | `/api/admin/students/:id`         | Get a single student by id      |
| PUT    | `/api/admin/students/:id`         | Update a student's details      |
| POST   | `/api/admin/attendance`           | Mark attendance for a student   |
| PUT    | `/api/admin/attendance/:id`       | Update an attendance record     |
| POST   | `/api/admin/fees`                 | Create a fee record              |
| PUT    | `/api/admin/fees/:id`             | Update a fee record (e.g. mark paid) |
| POST   | `/api/admin/timetable`            | Add a timetable entry           |
| PUT    | `/api/admin/timetable/:id`        | Update a timetable entry        |

---

## Example Requests

### Student login

```bash
curl -X POST http://localhost:5000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"libraryId":"LIB-8821","password":"Student@123"}'
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "libraryId": "LIB-8821",
      "name": "Aditi Agarwal",
      "role": "student"
    }
  }
}
```

### Get student profile

```bash
curl http://localhost:5000/api/student/profile \
  -H "Authorization: Bearer <student_token>"
```

Response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "library_id": "LIB-8821",
    "usn": "1MS20CS001",
    "first_name": "Aditi",
    "last_name": "Agarwal",
    "department": "Computer Science (CSE)",
    "semester": 7,
    "section": "A",
    "status": "Active"
  }
}
```

### Admin: add a student

```bash
curl -X POST http://localhost:5000/api/admin/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "libraryId": "LIB-9401",
    "firstName": "Kabir",
    "lastName": "Nair",
    "email": "kabir.nair@svce.edu.in",
    "password": "Student@123",
    "department": "Computer Science (CSE)",
    "semester": 3,
    "section": "A",
    "academicYear": "2026-27"
  }'
```

---

## Connecting from React Native (Expo)

Install axios in your Expo app:

```bash
npx expo install axios
```

Create an API client (e.g. `src/api/client.js`):

```javascript
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use your machine's LAN IP when testing on a physical device via Expo Go
// (localhost won't resolve from the phone) — e.g. http://192.168.1.10:5000/api
const BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT to every request automatically
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

Student login call:

```javascript
import apiClient from "./client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function studentLogin(libraryId, password) {
  const response = await apiClient.post("/auth/student/login", {
    libraryId,
    password,
  });

  const { token, user } = response.data.data;
  await AsyncStorage.setItem("authToken", token);
  return user;
}
```

Fetching the student's profile once logged in:

```javascript
export async function getStudentProfile() {
  const response = await apiClient.get("/student/profile");
  return response.data.data;
}
```

---

## Default Seed Credentials

| Role    | Login field | Value                    | Password      |
|---------|-------------|---------------------------|----------------|
| Student | Library ID  | `LIB-8821` (Aditi Agarwal)| `Student@123` |
| Student | Library ID  | `LIB-8845` (Rohan Verma)  | `Student@123` |
| Student | Library ID  | `LIB-8902` (Sanya Malhotra)| `Student@123` |
| Student | Library ID  | `LIB-9120` (Zoya Pasha)   | `Student@123` |
| Student | Library ID  | `LIB-9201` (Priya Sharma) | `Student@123` |
| Admin   | Email       | `admin@svce.edu.in`       | `Admin@123`   |
| Admin   | Email       | `registrar@svce.edu.in`   | `Admin@123`   |

> ⚠️ These are sample credentials for local development only. Change them (and the
> `JWT_SECRET`) before deploying anywhere real.

---

## Error Handling & Validation

- Every write endpoint validates its payload before touching the database and
  returns `400` with a `errors: []` array describing what's missing/invalid.
- Duplicate values (e.g. an email or library ID that already exists) return `409`.
- Missing resources (e.g. updating a student that doesn't exist) return `404`.
- Invalid/expired JWTs return `401`; valid JWTs with the wrong role return `403`.
- Unhandled errors are caught centrally in `middleware/errorHandler.js`, which also
  translates common PostgreSQL error codes (`23505`, `23503`, `23514`) into clean,
  descriptive JSON responses instead of leaking raw database errors.

---

## Screenshots

> _Add screenshots of the React Native app and/or Postman/curl responses here before
> publishing to GitHub._

| Login Screen | Student Dashboard | Admin Panel |
|--------------|--------------------|--------------|
| _screenshot_ | _screenshot_       | _screenshot_ |

---

## License

MIT — free to use and modify for learning or portfolio purposes.
