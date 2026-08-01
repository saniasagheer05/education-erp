
// src/api/studentsApi.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.3:5000/api';

async function authHeaders() {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function listStudents() {
  const res = await fetch(`${API_BASE_URL}/students`, {
    headers: await authHeaders(),
  });

  if (!res.ok) throw new Error('Failed to fetch students');
  return res.json();
}

export async function createStudent(data) {
  const res = await fetch(`${API_BASE_URL}/students`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to create student');
  return res.json();
}

export async function updateStudent(id, data) {
  const res = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to update student');
  return res.json();
}