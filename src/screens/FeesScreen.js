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
import { getStudentFees, createFee, updateFee } from "../api/feesApi";

const STATUS_OPTIONS = ["Paid", "Pending", "Partially Paid", "Overdue"];

export default function FeesScreen() {
  const [libraryId, setLibraryId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [isLoadingFees, setIsLoadingFees] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [status, setStatus] = useState("Pending");
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setSemester("");
    setAcademicYear("");
    setTotalAmount("");
    setPaidAmount("");
    setStatus("Pending");
  };

  const loadFees = async (studentId) => {
    setIsLoadingFees(true);
    try {
      const data = await getStudentFees(studentId);
      setFees(data);
    } catch (error) {
      Alert.alert("Error", error.message || "Could not load fee records.");
    } finally {
      setIsLoadingFees(false);
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
    setFees([]);
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
      setAcademicYear(match.academic_year || "");
      setSemester(String(match.semester || ""));
      await loadFees(match.id);
    } catch (error) {
      Alert.alert("Error", error.message || "Could not search for the student.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleEditRecord = (fee) => {
    setEditingId(fee.id);
    setSemester(String(fee.semester));
    setAcademicYear(fee.academic_year);
    setTotalAmount(String(fee.total_amount));
    setPaidAmount(String(fee.paid_amount));
    setStatus(fee.status);
  };

  const handleSaveRecord = async () => {
    if (!student) return;
    if (!semester.trim() || !academicYear.trim() || !totalAmount.trim()) {
      Alert.alert("Missing Details", "Please enter semester, academic year, and total amount.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await updateFee(editingId, {
          totalAmount: Number(totalAmount),
          paidAmount: Number(paidAmount || 0),
          status,
        });
      } else {
        await createFee({
          studentId: student.id,
          semester: Number(semester),
          academicYear: academicYear.trim(),
          totalAmount: Number(totalAmount),
          paidAmount: Number(paidAmount || 0),
          status,
        });
      }
      resetForm();
      await loadFees(student.id);
    } catch (error) {
      Alert.alert("Save Failed", error.message || "Could not save the fee record.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Fees" showSearch={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Manage Fees</Text>
        <Text style={styles.subheading}>
          Find a student by Library ID to view and update their fee records.
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

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                {editingId ? "Edit Fee Record" : "Add Fee Record"}
              </Text>

              <View style={styles.rowFields}>
                <View style={styles.rowFieldItem}>
                  <Text style={styles.fieldLabel}>Semester</Text>
                  <TextInput
                    style={styles.input}
                    value={semester}
                    onChangeText={setSemester}
                    placeholder="7"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="number-pad"
                    editable={!editingId}
                  />
                </View>
                <View style={styles.rowFieldItem}>
                  <Text style={styles.fieldLabel}>Academic Year</Text>
                  <TextInput
                    style={styles.input}
                    value={academicYear}
                    onChangeText={setAcademicYear}
                    placeholder="2023-24"
                    placeholderTextColor={colors.placeholder}
                    editable={!editingId}
                  />
                </View>
              </View>

              <View style={styles.rowFields}>
                <View style={styles.rowFieldItem}>
                  <Text style={styles.fieldLabel}>Total Amount</Text>
                  <TextInput
                    style={styles.input}
                    value={totalAmount}
                    onChangeText={setTotalAmount}
                    placeholder="85000"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.rowFieldItem}>
                  <Text style={styles.fieldLabel}>Paid Amount</Text>
                  <TextInput
                    style={styles.input}
                    value={paidAmount}
                    onChangeText={setPaidAmount}
                    placeholder="0"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

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
              <Text style={styles.sectionTitle}>Fee Records</Text>
              {isLoadingFees ? (
                <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
              ) : fees.length === 0 ? (
                <Text style={styles.emptyText}>No fee records yet.</Text>
              ) : (
                fees.map((fee) => {
                  const style = statusStyles[fee.status] || {
                    color: colors.textSecondary,
                    bg: colors.inactiveBg,
                  };
                  return (
                    <TouchableOpacity
                      key={fee.id}
                      style={styles.recordRow}
                      onPress={() => handleEditRecord(fee)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.recordSubject}>
                          Sem {fee.semester} • {fee.academic_year}
                        </Text>
                        <Text style={styles.recordDate}>
                          ₹{fee.paid_amount} / ₹{fee.total_amount} paid (due ₹{fee.due_amount})
                        </Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: style.bg }]}>
                        <Text style={[styles.badgeText, { color: style.color }]}>
                          {fee.status}
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
  rowFields: { flexDirection: "row", justifyContent: "space-between" },
  rowFieldItem: { flex: 1, marginRight: 10 },
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
