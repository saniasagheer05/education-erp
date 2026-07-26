import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { colors, statusStyles } from "../theme/colors";
import { mockStudents } from "../data/mockStudents";

const SEMESTERS = ["All", "Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5"];
const FORMATS = [
  { key: "xlsx", label: "Microsoft Excel", sub: ".xlsx file", icon: "grid-outline" },
  { key: "csv", label: "CSV Format", sub: "Plain text data", icon: "document-text-outline" },
  { key: "pdf", label: "PDF Document", sub: "Print-ready file", icon: "document-outline" },
];

export default function ExportStudentDataScreen() {
  const [semester, setSemester] = useState("All");
  const [format, setFormat] = useState("xlsx");
  const previewRows = mockStudents.slice(0, 5);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Export Student Data" showSearch={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Export Student Records</Text>
        <Text style={styles.subheading}>
          Configure filters and format to generate a batch data distribution report.
        </Text>

        <View style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={16} color={colors.info} />
          <Text style={styles.infoBannerText}>
            If section is not selected, all sections in the semester will be exported.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>425</Text>
          <Text style={styles.summaryLabel}>TOTAL STUDENTS FOUND</Text>
          <TouchableOpacity style={styles.downloadBtn}>
            <Ionicons name="download-outline" size={16} color="#fff" />
            <Text style={styles.downloadText}>Download Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.refreshBtn}>
            <Ionicons name="eye-outline" size={16} color={colors.textPrimary} />
            <Text style={styles.refreshText}>Refresh Preview</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="filter-outline" size={16} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>Hierarchical Filters</Text>
          </View>

          <Text style={styles.fieldLabel}>ACADEMIC YEAR</Text>
          <View style={styles.selectBox}>
            <Text style={styles.selectText}>2026-2027</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
          </View>

          <Text style={styles.fieldLabel}>DEPARTMENT</Text>
          <View style={styles.selectBox}>
            <Text style={styles.selectText}>Computer Science (CS)</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
          </View>

          <Text style={styles.fieldLabel}>SEMESTER</Text>
          <View style={styles.semesterRow}>
            {SEMESTERS.map((sem) => {
              const isActive = semester === sem;
              return (
                <TouchableOpacity
                  key={sem}
                  style={[styles.semChip, isActive && styles.semChipActive]}
                  onPress={() => setSemester(sem)}
                >
                  <Text style={[styles.semChipText, isActive && styles.semChipTextActive]}>
                    {sem}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.fieldLabel}>SECTION</Text>
          <View style={styles.selectBox}>
            <Text style={styles.selectText}>All Sections</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="code-slash-outline" size={16} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>Export Format</Text>
          </View>
          {FORMATS.map((f) => {
            const isActive = format === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.formatRow, isActive && styles.formatRowActive]}
                onPress={() => setFormat(f.key)}
              >
                <View style={styles.formatIconWrap}>
                  <Ionicons name={f.icon} size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formatLabel}>{f.label}</Text>
                  <Text style={styles.formatSub}>{f.sub}</Text>
                </View>
                <Ionicons
                  name={isActive ? "radio-button-on" : "radio-button-off"}
                  size={18}
                  color={isActive ? colors.primary : colors.border}
                />
              </TouchableOpacity>
            );
          })}

          <View style={styles.securityNote}>
            <Text style={styles.securityText}>
              SECURITY NOTE: All exports are tagged with your administrator ID for security
              audit compliance.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.previewHeader}>
            <View style={styles.sectionHeader}>
              <Ionicons name="albums-outline" size={16} color={colors.textPrimary} />
              <Text style={styles.sectionTitle}>Sample Preview (Top 5)</Text>
            </View>
            <View style={styles.filterAppliedTag}>
              <Text style={styles.filterAppliedText}>Active Filters</Text>
            </View>
          </View>

          {previewRows.map((row, index) => (
            <View
              key={row.libraryId}
              style={[
                styles.previewRow,
                index !== previewRows.length - 1 && styles.previewRowBorder,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.previewUsn}>{row.usn}</Text>
                <Text style={styles.previewName}>{row.name}</Text>
              </View>
              <Text style={styles.previewDept}>{row.dept}</Text>
              <View
                style={[
                  styles.previewBadge,
                  {
                    backgroundColor:
                      (statusStyles[row.status] || {}).bg || colors.inactiveBg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.previewBadgeText,
                    { color: (statusStyles[row.status] || {}).color || colors.inactive },
                  ]}
                >
                  {row.status}
                </Text>
              </View>
            </View>
          ))}

          <Text style={styles.previewFooter}>Showing 5 of 425 records in preview mode.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 18, fontWeight: "700", color: colors.textPrimary, marginTop: 4 },
  subheading: { fontSize: 13, color: colors.textSecondary, marginTop: 4, marginBottom: 12 },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.infoBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  summaryCard: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  summaryValue: { fontSize: 28, fontWeight: "800", color: "#fff" },
  summaryLabel: { fontSize: 11, color: "#9CA3AF", marginTop: 2, marginBottom: 14, letterSpacing: 0.5 },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 10,
  },
  downloadText: { color: "#fff", fontWeight: "700", fontSize: 13, marginLeft: 8 },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F2937",
    borderRadius: 8,
    paddingVertical: 12,
  },
  refreshText: { color: "#fff", fontWeight: "600", fontSize: 13, marginLeft: 8 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.textPrimary, marginLeft: 8 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 6,
    letterSpacing: 0.4,
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 6,
  },
  selectText: { fontSize: 13, color: colors.textPrimary },
  semesterRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 6 },
  semChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  semChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  semChipText: { fontSize: 12, color: colors.textSecondary, fontWeight: "600" },
  semChipTextActive: { color: colors.primary },
  formatRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  formatRowActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  formatIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  formatLabel: { fontSize: 13, fontWeight: "700", color: colors.textPrimary },
  formatSub: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  securityNote: {
    backgroundColor: colors.sidebarBg,
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  securityText: { fontSize: 11, color: colors.textSecondary, lineHeight: 16 },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterAppliedTag: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  filterAppliedText: { fontSize: 11, fontWeight: "700", color: colors.primary },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  previewRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  previewUsn: { fontSize: 12, fontWeight: "600", color: colors.primary },
  previewName: { fontSize: 13, color: colors.textPrimary, marginTop: 2 },
  previewDept: { fontSize: 12, color: colors.textSecondary, width: 40 },
  previewBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  previewBadgeText: { fontSize: 10, fontWeight: "700" },
  previewFooter: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
});
