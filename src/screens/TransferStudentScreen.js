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
import { listStudents, updateStudent } from "../api/studentsApi";

export default function TransferStudentScreen() {
  const [libraryId, setLibraryId] = useState("");
  const [targetDept, setTargetDept] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTransfer = async () => {
    const trimmedLibraryId = libraryId.trim();
    const trimmedDept = targetDept.trim();

    if (!trimmedLibraryId || !trimmedDept) {
      Alert.alert("Missing Details", "Please enter both a Library ID and a target department.");
      return;
    }

    setIsSubmitting(true);
    try {
      // There's no "find by Library ID" endpoint on the backend, so we
      // fetch the full student list and match client-side.
      const students = await listStudents();
      const match = students.find(
        (s) => (s.library_id || "").toLowerCase() === trimmedLibraryId.toLowerCase()
      );

      if (!match) {
        Alert.alert(
          "Student Not Found",
          `No student found with Library ID "${trimmedLibraryId}".`
        );
        return;
      }

      if (match.department === trimmedDept) {
        Alert.alert(
          "No Change Needed",
          `${match.first_name} ${match.last_name} is already in "${trimmedDept}".`
        );
        return;
      }

      const previousDept = match.department;
      await updateStudent(match.id, { department: trimmedDept });

      Alert.alert(
        "Transfer Complete",
        `${match.first_name} ${match.last_name} (${match.library_id}) moved from "${previousDept}" to "${trimmedDept}".`
      );
      setLibraryId("");
      setTargetDept("");
    } catch (error) {
      Alert.alert("Transfer Failed", error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Transfer Student" showSearch={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Transfer Student Record</Text>
        <Text style={styles.subheading}>
          Move a student between departments, sections, or academic years.
        </Text>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Library ID</Text>
          <TextInput
            style={styles.input}
            value={libraryId}
            onChangeText={setLibraryId}
            placeholder="Enter Library ID"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="none"
            editable={!isSubmitting}
          />

          <Text style={styles.fieldLabel}>Target Department</Text>
          <TextInput
            style={styles.input}
            value={targetDept}
            onChangeText={setTargetDept}
            placeholder="Enter target department"
            placeholderTextColor={colors.placeholder}
            editable={!isSubmitting}
          />

          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
            onPress={handleTransfer}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="swap-horizontal-outline" size={16} color="#fff" />
                <Text style={styles.submitText}>Initiate Transfer</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  heading: { fontSize: 18, fontWeight: "700", color: colors.textPrimary, marginTop: 4 },
  subheading: { fontSize: 13, color: colors.textSecondary, marginTop: 4, marginBottom: 16 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: colors.labelBlue, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 13, marginLeft: 8 },
});
