import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import Header from "../components/Header";
import { colors, statusStyles } from "../theme/colors";
import { listStudents } from "../api/studentsApi";
import { mapApiStudentToCard } from "../utils/mapStudent";

// Every number and row on this screen comes from a real GET /api/admin/students
// call - there is no mock/hardcoded data or fixed count anywhere here.
// Both export formats (CSV and PDF) are generated from that same real,
// currently-filtered data set, not a fixed preview.

const FORMATS = [
  { key: "csv", label: "CSV / Excel", sub: "Opens in Excel, Sheets, Numbers", icon: "grid-outline" },
  { key: "pdf", label: "PDF Document", sub: "Print-ready file", icon: "document-outline" },
];

const escapeCsv = (value) => {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export default function ExportStudentDataScreen() {
  const [allStudents, setAllStudents] = useState([]); // real, mapped API data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const [department, setDepartment] = useState("All");
  const [semester, setSemester] = useState("All");
  const [format, setFormat] = useState("csv");

  const fetchStudents = useCallback(async () => {
    try {
      setError(null);
      const data = await listStudents();
      setAllStudents(data.map(mapApiStudentToCard));
    } catch (err) {
      console.error("Failed to load students for export:", err);
      setError(err.message || "Could not load students.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Filter option lists are built from whatever departments/semesters
  // actually exist in the real data, never a fixed guess list.
  const departmentOptions = useMemo(
    () => ["All", ...Array.from(new Set(allStudents.map((s) => s.dept).filter(Boolean))).sort()],
    [allStudents]
  );
  const semesterOptions = useMemo(
    () => ["All", ...Array.from(new Set(allStudents.map((s) => s.sem).filter(Boolean))).sort((a, b) => Number(a) - Number(b))],
    [allStudents]
  );

  const filteredStudents = useMemo(() => {
    return allStudents.filter(
      (s) => (department === "All" || s.dept === department) && (semester === "All" || s.sem === semester)
    );
  }, [allStudents, department, semester]);

  const previewRows = filteredStudents.slice(0, 5);

  const buildCsv = (rows) => {
    const header = ["USN", "Library ID", "Name", "Department", "Semester", "Section", "Status"];
    const lines = rows.map((r) =>
      [r.usn, r.libraryId, r.name, r.dept, r.sem, r.section, r.status].map(escapeCsv).join(",")
    );
    return [header.join(","), ...lines].join("\n");
  };

  const buildPdfHtml = (rows) => {
    const rowsHtml = rows
      .map(
        (r) =>
          `<tr><td>${r.usn}</td><td>${r.libraryId}</td><td>${r.name}</td><td>${r.dept}</td><td>${r.sem}</td><td>${r.status}</td></tr>`
      )
      .join("");
    return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
      body{font-family:Helvetica,Arial,sans-serif;padding:24px;color:#111827}
      h1{font-size:16px;color:#2F5FCF} table{width:100%;border-collapse:collapse;margin-top:12px}
      th,td{border:1px solid #E5E7EB;padding:6px 8px;font-size:11px;text-align:left} th{background:#F8F9FB}
      </style></head><body><h1>Student Export - ${rows.length} record(s)</h1>
      <p style="font-size:11px;color:#6B7280">Department: ${department} | Semester: ${semester}</p>
      <table><thead><tr><th>USN</th><th>Library ID</th><th>Name</th><th>Department</th><th>Sem</th><th>Status</th></tr></thead>
      <tbody>${rowsHtml}</tbody></table></body></html>`;
  };

  const handleDownload = async () => {
    if (filteredStudents.length === 0) {
      Alert.alert("Nothing to export", "No students match the selected filters.");
      return;
    }
    try {
      setIsExporting(true);
      let fileUri;
      if (format === "csv") {
        const csv = buildCsv(filteredStudents);
        fileUri = `${FileSystem.cacheDirectory}students_export_${Date.now()}.csv`;
        await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
      } else {
        const html = buildPdfHtml(filteredStudents);
        const { uri } = await Print.printToFileAsync({ html });
        fileUri = uri;
      }
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { dialogTitle: "Student export" });
      } else {
        Alert.alert("Export ready", `Saved to: ${fileUri}`);
      }
    } catch (err) {
      console.error("Export failed:", err);
      Alert.alert("Export failed", err.message || "Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Export Student Data" showSearch={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Export Student Records</Text>
        <Text style={styles.subheading}>Filters and counts below reflect the current database.</Text>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Ionicons name="alert-circle-outline" size={40} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchStudents}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{filteredStudents.length}</Text>
              <Text style={styles.summaryLabel}>TOTAL STUDENTS FOUND</Text>
              <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload} disabled={isExporting}>
                {isExporting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="download-outline" size={16} color="#fff" />
                    <Text style={styles.downloadText}>Download Data</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Ionicons name="filter-outline" size={16} color={colors.textPrimary} />
                <Text style={styles.sectionTitle}>Filters</Text>
              </View>

              <Text style={styles.fieldLabel}>DEPARTMENT</Text>
              <View style={styles.chipRow}>
                {departmentOptions.map((dept) => {
                  const isActive = department === dept;
                  return (
                    <TouchableOpacity key={dept} style={[styles.chip, isActive && styles.chipActive]} onPress={() => setDepartment(dept)}>
                      <Text style={[styles.chipText, isActive && styles.chipTextActive]} numberOfLines={1}>
                        {dept}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.fieldLabel}>SEMESTER</Text>
              <View style={styles.chipRow}>
                {semesterOptions.map((sem) => {
                  const isActive = semester === sem;
                  return (
                    <TouchableOpacity key={sem} style={[styles.chip, isActive && styles.chipActive]} onPress={() => setSemester(sem)}>
                      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{sem === "All" ? "All" : `Sem ${sem}`}</Text>
                    </TouchableOpacity>
                  );
                })}
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
                  <TouchableOpacity key={f.key} style={[styles.formatRow, isActive && styles.formatRowActive]} onPress={() => setFormat(f.key)}>
                    <View style={styles.formatIconWrap}>
                      <Ionicons name={f.icon} size={18} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.formatLabel}>{f.label}</Text>
                      <Text style={styles.formatSub}>{f.sub}</Text>
                    </View>
                    <Ionicons name={isActive ? "radio-button-on" : "radio-button-off"} size={18} color={isActive ? colors.primary : colors.border} />
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Ionicons name="albums-outline" size={16} color={colors.textPrimary} />
                <Text style={styles.sectionTitle}>Preview (Top 5)</Text>
              </View>
              {previewRows.length === 0 ? (
                <Text style={styles.previewFooter}>No students match the selected filters.</Text>
              ) : (
                <>
                  {previewRows.map((row, index) => (
                    <View key={row.libraryId} style={[styles.previewRow, index !== previewRows.length - 1 && styles.previewRowBorder]}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.previewUsn}>{row.usn}</Text>
                        <Text style={styles.previewName}>{row.name}</Text>
                      </View>
                      <Text style={styles.previewDept}>{row.dept}</Text>
                      <View style={[styles.previewBadge, { backgroundColor: (statusStyles[row.status] || {}).bg || colors.inactiveBg }]}>
                        <Text style={[styles.previewBadgeText, { color: (statusStyles[row.status] || {}).color || colors.inactive }]}>{row.status}</Text>
                      </View>
                    </View>
                  ))}
                  <Text style={styles.previewFooter}>Showing {previewRows.length} of {filteredStudents.length} matching records.</Text>
                </>
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
  subheading: { fontSize: 13, color: colors.textSecondary, marginTop: 4, marginBottom: 12 },
  center: { alignItems: "center", paddingVertical: 30 },
  errorText: { color: colors.danger, marginTop: 8, textAlign: "center" },
  retryBtn: { marginTop: 12, paddingHorizontal: 20, paddingVertical: 9, borderRadius: 8, backgroundColor: colors.primary },
  retryText: { color: "#FFFFFF", fontWeight: "600" },
  summaryCard: { backgroundColor: "#111827", borderRadius: 14, padding: 18, marginBottom: 16 },
  summaryValue: { fontSize: 28, fontWeight: "800", color: "#fff" },
  summaryLabel: { fontSize: 11, color: "#9CA3AF", marginTop: 2, marginBottom: 14, letterSpacing: 0.5 },
  downloadBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 12 },
  downloadText: { color: "#fff", fontWeight: "700", fontSize: 13, marginLeft: 8 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.textPrimary, marginLeft: 8 },
  fieldLabel: { fontSize: 11, fontWeight: "700", color: colors.textSecondary, marginBottom: 8, marginTop: 6, letterSpacing: 0.4 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 4 },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingVertical: 8, paddingHorizontal: 14, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  chipText: { fontSize: 12, color: colors.textSecondary, fontWeight: "600" },
  chipTextActive: { color: colors.primary },
  formatRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, marginBottom: 10 },
  formatRowActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  formatIconWrap: { width: 36, height: 36, borderRadius: 8, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginRight: 12 },
  formatLabel: { fontSize: 13, fontWeight: "700", color: colors.textPrimary },
  formatSub: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  previewRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  previewRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  previewUsn: { fontSize: 12, fontWeight: "600", color: colors.primary },
  previewName: { fontSize: 13, color: colors.textPrimary, marginTop: 2 },
  previewDept: { fontSize: 12, color: colors.textSecondary, width: 50 },
  previewBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  previewBadgeText: { fontSize: 10, fontWeight: "700" },
  previewFooter: { fontSize: 11, color: colors.textMuted, textAlign: "center", marginTop: 8, fontStyle: "italic" },
});
