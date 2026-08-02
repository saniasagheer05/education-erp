import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { colors, statusStyles } from "../theme/colors";
import { listStudents } from "../api/studentsApi";
import {
  getStudentAttendance,
  createAttendance,
  updateAttendance,
} from "../api/attendanceApi";

const STATUS_OPTIONS = ["Present", "Absent", "Late", "Excused"];

export default function AttendanceScreen() {
  const [libraryId, setLibraryId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [student, setStudent] = useState(null);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  // Add/edit form state
  const [editingId, setEditingId] = useState(null); // null = adding new
  const [subject, setSubject] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setSubject("");
    setAttendanceDate("");
    setStatus("Present");
  };

  const loadAttendance = async (studentId) => {
    setIsLoadingRecords(true);
    try {
      const data = await getStudentAttendance(studentId);
      setRecords(data.records);
      setSummary(data.summary);
    } catch (error) {
      Alert.alert("Error", error.message || "Could not load attendance.");
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleFindStudent = async () => {
    const trimmed = libraryId.trim();
    if (!trimmed) {
      Alert.alert("Missing Library ID", "Please enter a Library ID to search.");
      return;
    }

    setIsSearching(true);
    setStudent(null);
    setRecords([]);
    setSummary([]);
    resetForm();
    try {
      const students = await listStudents();
      const match = students.find(
        (s) => (s.library_id || "").toLowerCase() === trimmed.toLowerCase()
      );

      if (!match) {
        Alert.alert("Not Found", `No student found with Library ID "${trimmed}".`);
        return;
      }

      setStudent(match);
      await loadAttendance(match.id);
    } catch (error) {
      Alert.alert("Error", error.message || "Could not search for the student.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleEditRecord = (record) => {
    setEditingId(record.id);
    setSubject(record.subject);
    setAttendanceDate(record.attendance_date.slice(0, 10));
    setStatus(record.status);
  };

  const handleSaveRecord = async () => {
    if (!student) return;
    if (!subject.trim() || !attendanceDate.trim()) {
      Alert.alert("Missing Details", "Please enter a subject and date (YYYY-MM-DD).");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await updateAttendance(editingId, {
          subject: subject.trim(),
          attendanceDate: attendanceDate.trim(),
          status,
        });
      } else {
        await createAttendance({
          studentId: student.id,
          subject: subject.trim(),
          attendanceDate: attendanceDate.trim(),
          status,
        });
      }
      resetForm();
      await loadAttendance(student.id);
    } catch (error) {
      Alert.alert("Save Failed", error.message || "Could not save the attendance record.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Attendance" showSearch={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Manage Attendance</Text>
        <Text style={styles.subheading}>
          Find a student by Library ID to view and update their attendance.
        </Text>

        <View style={styles.searchRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={libraryId}
            onChangeText={setLibraryId}
            placeholder="Enter Library ID"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="none"
            editable={!isSearching}
          />
          <TouchableOpacity
            style={styles.findBtn}
            onPress={handleFindStudent}
            disabled={isSearching}
          >
            {isSearching ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="search" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {student && (
          <>
            <View style={styles.studentCard}>
              <Text style={styles.studentName}>
                {student.first_name} {student.last_name}
              </Text>
              <Text style={styles.studentMeta}>
                {student.library_id} • {student.department} • Sem {student.semester}
              </Text>
            </View>

            {summary.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Attendance Summary</Text>
                {summary.map((s) => (
                  <View key={s.subject} style={styles.summaryRow}>
                    <Text style={styles.summarySubject}>{s.subject}</Text>
                    <Text style={styles.summaryPct}>{s.attendance_percentage}%</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                {editingId ? "Edit Record" : "Add Attendance Record"}
              </Text>

              <Text style={styles.fieldLabel}>Subject</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="e.g. Data Structures"
                placeholderTextColor={colors.placeholder}
              />

              <Text style={styles.fieldLabel}>Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={attendanceDate}
                onChangeText={setAttendanceDate}
                placeholder="2026-08-02"
                placeholderTextColor={colors.placeholder}
              />

              <Text style={styles.fieldLabel}>Status</Text>
              <View style={styles.statusRow}>
                {STATUS_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.statusChip, status === opt && styles.statusChipActive]}
                    onPress={() => setStatus(opt)}
                  >
                    <Text
                      style={[
                        styles.statusChipText,
                        status === opt && styles.statusChipTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.formActions}>
                {editingId && (
                  <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveRecord}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.saveText}>{editingId ? "Update" : "Add Record"}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Records</Text>
              {isLoadingRecords ? (
                <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
              ) : records.length === 0 ? (
                <Text style={styles.emptyText}>No attendance records yet.</Text>
              ) : (
                records.map((record) => {
                  const style = statusStyles[record.status] || {
                    color: colors.textSecondary,
                    bg: colors.inactiveBg,
                  };
                  return (
                    <TouchableOpacity
                      key={record.id}
                      style={styles.recordRow}
                      onPress={() => handleEditRecord(record)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.recordSubject}>{record.subject}</Text>
                        <Text style={styles.recordDate}>
                          {record.attendance_date.slice(0, 10)}
                        </Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: style.bg }]}>
                        <Text style={[styles.badgeText, { color: style.color }]}>
                          {record.status}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 18, fontWeight: "700", color: colors.textPrimary, marginTop: 4 },
  subheading: { fontSize: 13, color: colors.textSecondary, marginTop: 4, marginBottom: 16 },
  searchRow: { flexDirection: "row", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  findBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  studentCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  studentName: { fontSize: 14, fontWeight: "700", color: colors.textPrimary },
  studentMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.textPrimary, marginBottom: 12 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summarySubject: { fontSize: 13, color: colors.textPrimary },
  summaryPct: { fontSize: 13, fontWeight: "700", color: colors.primary },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: colors.labelBlue, marginBottom: 6 },
  statusRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 4 },
  statusChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  statusChipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  statusChipText: { fontSize: 12, fontWeight: "600", color: colors.textSecondary },
  statusChipTextActive: { color: colors.primary },
  formActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  cancelText: { fontSize: 13, fontWeight: "600", color: colors.textPrimary },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.primary,
    minWidth: 100,
    alignItems: "center",
  },
  saveText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  emptyText: { fontSize: 13, color: colors.textMuted },
  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  recordSubject: { fontSize: 13, fontWeight: "600", color: colors.textPrimary },
  recordDate: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: "700" },
});
