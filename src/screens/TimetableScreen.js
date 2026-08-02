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
import { colors } from "../theme/colors";
import { listStudents } from "../api/studentsApi";
import {
  getStudentTimetable,
  createTimetableEntry,
  updateTimetableEntry,
} from "../api/timetableApi";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TimetableScreen() {
  const [libraryId, setLibraryId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [student, setStudent] = useState(null); // { id, department, semester, section }
  const [entries, setEntries] = useState([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [periodNumber, setPeriodNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setDayOfWeek("Monday");
    setPeriodNumber("");
    setSubject("");
    setFacultyName("");
    setStartTime("");
    setEndTime("");
    setRoomNumber("");
  };

  const loadTimetable = async (studentId) => {
    setIsLoadingEntries(true);
    try {
      const data = await getStudentTimetable(studentId);
      setStudent(data.student);
      setEntries(data.timetable);
    } catch (error) {
      Alert.alert("Error", error.message || "Could not load timetable.");
    } finally {
      setIsLoadingEntries(false);
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
    setEntries([]);
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

      await loadTimetable(match.id);
    } catch (error) {
      Alert.alert("Error", error.message || "Could not search for the student.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleEditEntry = (entry) => {
    setEditingId(entry.id);
    setDayOfWeek(entry.day_of_week);
    setPeriodNumber(String(entry.period_number));
    setSubject(entry.subject);
    setFacultyName(entry.faculty_name);
    setStartTime(entry.start_time.slice(0, 5));
    setEndTime(entry.end_time.slice(0, 5));
    setRoomNumber(entry.room_number || "");
  };

  const handleSaveEntry = async () => {
    if (!student) return;
    if (!periodNumber.trim() || !subject.trim() || !facultyName.trim() || !startTime.trim() || !endTime.trim()) {
      Alert.alert("Missing Details", "Please fill in period, subject, faculty, and both times.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await updateTimetableEntry(editingId, {
          subject: subject.trim(),
          facultyName: facultyName.trim(),
          startTime: startTime.trim(),
          endTime: endTime.trim(),
          roomNumber: roomNumber.trim() || null,
        });
      } else {
        await createTimetableEntry({
          department: student.department,
          semester: student.semester,
          section: student.section,
          dayOfWeek,
          periodNumber: Number(periodNumber),
          subject: subject.trim(),
          facultyName: facultyName.trim(),
          startTime: startTime.trim(),
          endTime: endTime.trim(),
          roomNumber: roomNumber.trim() || null,
        });
      }
      resetForm();
      await loadTimetable(student.id);
    } catch (error) {
      Alert.alert("Save Failed", error.message || "Could not save the timetable entry.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Timetable" showSearch={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Manage Timetable</Text>
        <Text style={styles.subheading}>
          Find a student by Library ID to view and update their class timetable.
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
              <Text style={styles.studentMeta}>
                {student.department} • Sem {student.semester} • Section {student.section}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                {editingId ? "Edit Period" : "Add Period"}
              </Text>

              {!editingId && (
                <>
                  <Text style={styles.fieldLabel}>Day</Text>
                  <View style={styles.dayRow}>
                    {DAYS.map((day) => (
                      <TouchableOpacity
                        key={day}
                        style={[styles.dayChip, dayOfWeek === day && styles.dayChipActive]}
                        onPress={() => setDayOfWeek(day)}
                      >
                        <Text
                          style={[
                            styles.dayChipText,
                            dayOfWeek === day && styles.dayChipTextActive,
                          ]}
                        >
                          {day.slice(0, 3)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <View style={styles.rowFields}>
                <View style={styles.rowFieldItem}>
                  <Text style={styles.fieldLabel}>Period #</Text>
                  <TextInput
                    style={styles.input}
                    value={periodNumber}
                    onChangeText={setPeriodNumber}
                    placeholder="1"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="number-pad"
                    editable={!editingId}
                  />
                </View>
                <View style={styles.rowFieldItem}>
                  <Text style={styles.fieldLabel}>Room</Text>
                  <TextInput
                    style={styles.input}
                    value={roomNumber}
                    onChangeText={setRoomNumber}
                    placeholder="CS-101"
                    placeholderTextColor={colors.placeholder}
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Subject</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="e.g. Data Structures"
                placeholderTextColor={colors.placeholder}
              />

              <Text style={styles.fieldLabel}>Faculty Name</Text>
              <TextInput
                style={styles.input}
                value={facultyName}
                onChangeText={setFacultyName}
                placeholder="e.g. Dr. Meera Iyer"
                placeholderTextColor={colors.placeholder}
              />

              <View style={styles.rowFields}>
                <View style={styles.rowFieldItem}>
                  <Text style={styles.fieldLabel}>Start Time (HH:MM)</Text>
                  <TextInput
                    style={styles.input}
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="09:00"
                    placeholderTextColor={colors.placeholder}
                  />
                </View>
                <View style={styles.rowFieldItem}>
                  <Text style={styles.fieldLabel}>End Time (HH:MM)</Text>
                  <TextInput
                    style={styles.input}
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholder="10:00"
                    placeholderTextColor={colors.placeholder}
                  />
                </View>
              </View>

              <View style={styles.formActions}>
                {editingId && (
                  <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveEntry}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.saveText}>{editingId ? "Update" : "Add Period"}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Weekly Timetable</Text>
              {isLoadingEntries ? (
                <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
              ) : entries.length === 0 ? (
                <Text style={styles.emptyText}>No timetable entries yet.</Text>
              ) : (
                entries.map((entry) => (
                  <TouchableOpacity
                    key={entry.id}
                    style={styles.recordRow}
                    onPress={() => handleEditEntry(entry)}
                  >
                    <View style={styles.dayBadge}>
                      <Text style={styles.dayBadgeText}>{entry.day_of_week.slice(0, 3)}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.recordSubject}>
                        P{entry.period_number} • {entry.subject}
                      </Text>
                      <Text style={styles.recordDate}>
                        {entry.faculty_name} • {entry.start_time.slice(0, 5)}–
                        {entry.end_time.slice(0, 5)}
                        {entry.room_number ? ` • ${entry.room_number}` : ""}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
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
  studentMeta: { fontSize: 12, color: colors.textSecondary },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.textPrimary, marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: colors.labelBlue, marginBottom: 6 },
  dayRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 4 },
  dayChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  dayChipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  dayChipText: { fontSize: 12, fontWeight: "600", color: colors.textSecondary },
  dayChipTextActive: { color: colors.primary },
  rowFields: { flexDirection: "row", justifyContent: "space-between" },
  rowFieldItem: { flex: 1, marginRight: 10 },
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
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  dayBadgeText: { fontSize: 11, fontWeight: "700", color: colors.primary },
});
