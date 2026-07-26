import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { colors } from "../theme/colors";

export default function TransferStudentScreen() {
  const [libraryId, setLibraryId] = useState("");
  const [targetDept, setTargetDept] = useState("");

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
          />

          <Text style={styles.fieldLabel}>Target Department</Text>
          <TextInput
            style={styles.input}
            value={targetDept}
            onChangeText={setTargetDept}
            placeholder="Enter target department"
            placeholderTextColor={colors.placeholder}
          />

          <TouchableOpacity style={styles.submitBtn}>
            <Ionicons name="swap-horizontal-outline" size={16} color="#fff" />
            <Text style={styles.submitText}>Initiate Transfer</Text>
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
  submitText: { color: "#fff", fontWeight: "700", fontSize: 13, marginLeft: 8 },
});
