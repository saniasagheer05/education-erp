import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { colors } from "../theme/colors";

const STEPS = [
  {
    num: "01",
    title: "Download",
    body: "Use our standardized template to ensure data compatibility.",
  },
  {
    num: "02",
    title: "Validate",
    body: "Our engine checks for duplicates, missing fields, and department codes.",
  },
  {
    num: "03",
    title: "Execute",
    body: "Commit valid records to the student registry with one click.",
  },
];

export default function ImportStudentsScreen() {
  const [fileSelected, setFileSelected] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Import Students" showSearch={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heading}>Bulk Student Admission</Text>
            <Text style={styles.subheading}>
              Upload student records via Excel or CSV for automated enrollment processing.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.templateLink}>
          <Ionicons name="download-outline" size={16} color={colors.primary} />
          <Text style={styles.templateLinkText}>Download Template</Text>
        </TouchableOpacity>

        <View style={styles.dropZone}>
          <View style={styles.dropIconWrap}>
            <Ionicons name="cloud-upload-outline" size={30} color={colors.primary} />
          </View>
          <Text style={styles.dropTitle}>Drag & Drop Enrollment Files</Text>
          <Text style={styles.dropSubtitle}>
            Supported formats: .xlsx, .csv (Max file size: 25MB)
          </Text>
          <TouchableOpacity style={styles.chooseFileBtn} onPress={() => setFileSelected(true)}>
            <Ionicons name="attach-outline" size={16} color="#fff" />
            <Text style={styles.chooseFileText}>Choose File</Text>
          </TouchableOpacity>
        </View>

        {fileSelected && (
          <View style={styles.fileRow}>
            <View style={styles.fileInfo}>
              <Ionicons name="document-text-outline" size={22} color={colors.primary} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.fileName}>admissions_spring_2024.xlsx</Text>
                <Text style={styles.fileMeta}>1.2 MB • Ready for validation</Text>
              </View>
            </View>
            <View style={styles.fileActions}>
              <TouchableOpacity style={styles.validateBtn}>
                <Ionicons name="checkmark-circle-outline" size={15} color={colors.primary} />
                <Text style={styles.validateText}>Validate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.importBtn}>
                <Ionicons name="cloud-upload-outline" size={15} color={colors.textSecondary} />
                <Text style={styles.importText}>Import</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.validationCard}>
          <Text style={styles.validationTitle}>Validation Summary</Text>
          <Text style={styles.validationEmpty}>
            Run validation to see breakdown and address potential data errors.
          </Text>
        </View>

        <Text style={styles.stepsHeading}>How it works</Text>
        {STEPS.map((step) => (
          <View key={step.num} style={styles.stepRow}>
            <Text style={styles.stepNum}>{step.num}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepBody}>{step.body}</Text>
            </View>
          </View>
        ))}

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpBody}>
            Check the documentation for correct Department ID and Program Codes to avoid
            validation errors.
          </Text>
          <TouchableOpacity>
            <Text style={styles.helpLink}>View Code Reference</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  headingRow: { flexDirection: "row", alignItems: "flex-start" },
  heading: { fontSize: 18, fontWeight: "700", color: colors.textPrimary, marginTop: 6 },
  subheading: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  templateLink: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 12,
    marginBottom: 16,
  },
  templateLinkText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 13,
    marginLeft: 6,
  },
  dropZone: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: "center",
    marginBottom: 16,
  },
  dropIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  dropTitle: { fontSize: 15, fontWeight: "700", color: colors.textPrimary },
  dropSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  chooseFileBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  chooseFileText: { color: "#fff", fontWeight: "700", fontSize: 13, marginLeft: 8 },
  fileRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  fileInfo: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  fileName: { fontSize: 13, fontWeight: "600", color: colors.textPrimary },
  fileMeta: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  fileActions: { flexDirection: "row" },
  validateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  validateText: { color: colors.primary, fontWeight: "700", fontSize: 12, marginLeft: 6 },
  importBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.sidebarBg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  importText: { color: colors.textSecondary, fontWeight: "700", fontSize: 12, marginLeft: 6 },
  validationCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  validationTitle: { fontSize: 14, fontWeight: "700", color: colors.textPrimary, marginBottom: 8 },
  validationEmpty: { fontSize: 12, color: colors.textMuted },
  stepsHeading: { fontSize: 15, fontWeight: "700", color: colors.textPrimary, marginBottom: 10 },
  stepRow: { flexDirection: "row", marginBottom: 16 },
  stepNum: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textMuted,
    width: 32,
  },
  stepTitle: { fontSize: 13, fontWeight: "700", color: colors.textPrimary },
  stepBody: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  helpCard: {
    backgroundColor: colors.sidebarBg,
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
  },
  helpTitle: { fontSize: 14, fontWeight: "700", color: colors.textPrimary, marginBottom: 6 },
  helpBody: { fontSize: 12, color: colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  helpLink: { fontSize: 12, fontWeight: "700", color: colors.primary },
});
