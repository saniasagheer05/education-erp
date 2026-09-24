// src/api/studentPortalApi.js
// Client methods for student self-service endpoints.

import { authorizedFetch } from "./apiClient";

/**
 * GET /api/student/profile
 * Returns the logged-in student's full profile record.
 */
export async function getStudentProfile() {
  const result = await authorizedFetch("/student/profile", {
    method: "GET",
  });
  return result.data;
}

/**
 * GET /api/student/attendance
 * Returns { records, summary } for the logged-in student.
 */
export async function getStudentAttendance(params = {}) {
  const query = new URLSearchParams();
  if (params.subject) query.append("subject", params.subject);
  if (params.fromDate) query.append("fromDate", params.fromDate);
  if (params.toDate) query.append("toDate", params.toDate);

  const qs = query.toString() ? `?${query.toString()}` : "";
  const result = await authorizedFetch(`/student/attendance${qs}`, {
    method: "GET",
  });
  return result.data;
}

/**
 * GET /api/student/fees
 * Returns an array of fee records across all semesters.
 */
export async function getStudentFees() {
  const result = await authorizedFetch("/student/fees", {
    method: "GET",
  });
  return result.data;
}

/**
 * GET /api/student/timetable
 * Returns the weekly class schedule for the student's department, semester, and section.
 */
export async function getStudentTimetable() {
  const result = await authorizedFetch("/student/timetable", {
    method: "GET",
  });
  return result.data;
}
