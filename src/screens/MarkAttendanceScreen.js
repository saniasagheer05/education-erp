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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { colors } from "../theme/colors";
import { listStudents } from "../api/studentsApi";
import { bulkMarkAttendance } from "../api/attendanceApi";

const DEPARTMENTS = [
  "Computer Science (CSE)",
  "Mechanical",
  "Electronics (ECE)",
  "Information Science (ISE)",
  "Civil",
];

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function MarkAttendanceScreen() {
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [semester, setSemester] = useState(7);
  const [subject, setSubject] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(getTodayDateString());

  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({}); // { [studentId]: "Present" | "Absent" }
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const handleFetchStudents = async () => {
    if (!subject.trim()) {
      Alert.alert("Missing Subject", "Please enter the subject name before fetching students.");
      return;
    }

    if (!attendanceDate.trim()) {
      Alert.alert("Missing Date", "Please enter the attendance date (YYYY-MM-DD).");
      return;
    }

    setIsLoadingStudents(true);
    setHasFetched(true);
    try {
      const data = await listStudents({
        department,
        semester,
        status: "Active",
      });

      setStudents(data);

      // Default all to Present
      const initialMap = {};
      data.forEach((s) => {
        initialMap[s.id] = "Present";
      });
      setAttendanceMap(initialMap);
    } catch (err) {
      console.error("Failed to load students:", err);
      Alert.alert("Error", err.message || "Failed to load students for this class.");
      setStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleToggleStatus = (studentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAllPresent = () => {
    const updated = {};
    students.forEach((s) => {
      updated[s.id] = "Present";
    });
    setAttendanceMap(updated);
  };

  const handleMarkAllAbsent = () => {
    const updated = {};
    students.forEach((s) => {
      updated[s.id] = "Absent";
    });
    setAttendanceMap(updated);
  };

  const handleSubmit = async () => {
    if (students.length === 0) {
      Alert.alert("No Students", "There are no students to submit attendance for.");
      return;
    }

    const records = students.map((s) => ({
      studentId: s.id,
      status: attendanceMap[s.id] || "Present",
    }));

    const presentCount = records.filter((r) => r.status === "Present").length;
    const absentCount = records.filter((r) => r.status === "Absent").length;

    Alert.alert(
      "Confirm Submission",
      `Submit attendance for ${records.length} students?\n\nPresent: ${presentCount}\nAbsent: ${absentCount}\nDate: ${attendanceDate}\nSubject: ${subject}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: async () => {
            setIsSubmitting(true);
            try {
              const res = await bulkMarkAttendance({
                subject: subject.trim(),
                attendanceDate: attendanceDate.trim(),
                records,
              });

              Alert.alert(
                "Success",
                res.message || `Marked attendance for ${records.length} students successfully.`
              );
            } catch (err) {
              console.error("Bulk mark failed:", err);
              Alert.alert("Error", err.message || "Failed to record attendance.");
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Header title="Mark Attendance" showSearch={false} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Class Selection Card */}
        <View style={styles.formCard}>
          <Text style={styles.cardHeader}>Select Class & Subject</Text>

          {/* Department Selection */}
          <Text style={styles.label}>Department</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {DEPARTMENTS.map((dept) => {
              const isSelected = department === dept;
              return (
                <TouchableOpacity
                  key={dept}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setDepartment(dept)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {dept}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Semester Selection */}
          <Text style={[styles.label, { marginTop: 12 }]}>Semester</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {SEMESTERS.map((sem) => {
              const isSelected = semester === sem;
              return (
                <TouchableOpacity
                  key={sem}
                  style={[styles.semChip, isSelected && styles.semChipSelected]}
                  onPress={() => setSemester(sem)}
                >
                  <Text style={[styles.semChipText, isSelected && styles.semChipTextSelected]}>
                    Sem {sem}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Subject & Date Inputs */}
          <View style={styles.inputsRow}>
            <View style={styles.inputCol}>
              <Text style={styles.label}>Subject Name *</Text>
              <TextInput
                style={styles.textInput}
                value={subject}
                onChangeText={setSubject}
                placeholder="e.g. Data Structures"
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.inputCol}>
              <Text style={styles.label}>Date (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.textInput}
                value={attendanceDate}
                onChangeText={setAttendanceDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.placeholder}
              />
            </View>
          </View>

          {/* Fetch Students Button */}
          <TouchableOpacity
            style={styles.fetchBtn}
            onPress={handleFetchStudents}
            disabled={isLoadingStudents}
          >
            {isLoadingStudents ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="people-outline" size={18} color="#fff" />
                <Text style={styles.fetchBtnText}>Load Class Students</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Student List Section */}
        {hasFetched && (
          <View style={styles.listSection}>
            <View style={styles.listHeaderRow}>
              <View>
                <Text style={styles.listSectionTitle}>Students Roster</Text>
                <Text style={styles.listSubtitle}>
                  {students.length} enrolled student(s)
                </Text>
              </View>

              {students.length > 0 && (
                <View style={styles.bulkActionsRow}>
                  <TouchableOpacity
                    style={styles.bulkActionBtn}
                    onPress={handleMarkAllPresent}
                  >
                    <Ionicons name="checkmark-done" size={14} color={colors.success} />
                    <Text style={[styles.bulkActionText, { color: colors.success }]}>
                      All Present
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bulkActionBtn}
                    onPress={handleMarkAllAbsent}
                  >
                    <Ionicons name="close" size={14} color={colors.danger} />
                    <Text style={[styles.bulkActionText, { color: colors.danger }]}>
                      All Absent
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {isLoadingStudents ? (
              <View style={styles.stateCard}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.stateText}>Loading students...</Text>
              </View>
            ) : students.length === 0 ? (
              <View style={styles.stateCard}>
                <Ionicons name="people-outline" size={40} color={colors.textMuted} />
                <Text style={styles.stateTitle}>No students found</Text>
                <Text style={styles.stateSub}>
                  No active students enrolled in {department}, Semester {semester}.
                </Text>
              </View>
            ) : (
              <>
                {students.map((student, idx) => {
                  const currentStatus = attendanceMap[student.id] || "Present";
                  const isPresent = currentStatus === "Present";
                  const isAbsent = currentStatus === "Absent";

                  return (
                    <View key={student.id} style={styles.studentCard}>
                      <View style={styles.studentInfo}>
                        <View style={styles.indexCircle}>
                          <Text style={styles.indexText}>{idx + 1}</Text>
                        </View>
                        <View style={styles.studentTextGroup}>
                          <Text style={styles.studentName}>
                            {student.first_name} {student.last_name}
                          </Text>
                          <Text style={styles.studentMeta}>
                            ID: {student.library_id} {student.usn ? `· ${student.usn}` : ""} · Sec {student.section}
                          </Text>
                        </View>
                      </View>

                      {/* Present / Absent Toggle Buttons */}
                      <View style={styles.toggleRow}>
                        <TouchableOpacity
                          style={[
                            styles.toggleBtn,
                            isPresent && styles.togglePresentActive,
                          ]}
                          onPress={() => handleToggleStatus(student.id, "Present")}
                        >
                          <Text
                            style={[
                              styles.toggleText,
                              isPresent && styles.toggleTextActive,
                            ]}
                          >
                            P
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.toggleBtn,
                            isAbsent && styles.toggleAbsentActive,
                          ]}
                          onPress={() => handleToggleStatus(student.id, "Absent")}
                        >
                          <Text
                            style={[
                              styles.toggleText,
                              isAbsent && styles.toggleTextActive,
                            ]}
                          >
                            A
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    isSubmitting && { opacity: 0.7 },
                  ]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                      <Text style={styles.submitBtnText}>
                        Save & Submit Attendance ({students.length})
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  formCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.labelBlue,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    backgroundColor: colors.sidebarBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  semChip: {
    backgroundColor: colors.sidebarBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  semChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  semChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  semChipTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  inputsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  inputCol: { flex: 1 },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    color: colors.textPrimary,
  },
  fetchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
    marginTop: 16,
  },
  fetchBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  listSection: { marginTop: 4 },
  listHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  listSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  listSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bulkActionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  bulkActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.sidebarBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  bulkActionText: {
    fontSize: 11,
    fontWeight: "600",
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  studentInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  indexCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.sidebarBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  indexText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  studentTextGroup: { flex: 1 },
  studentName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  studentMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 10,
  },
  toggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.sidebarBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  togglePresentActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  toggleAbsentActive: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: "#fff",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
    marginTop: 16,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  stateCard: {
    backgroundColor: colors.sidebarBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 28,
    alignItems: "center",
  },
  stateText: {
    marginTop: 10,
    fontSize: 13,
    color: colors.textSecondary,
  },
  stateTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 10,
  },
  stateSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
});
