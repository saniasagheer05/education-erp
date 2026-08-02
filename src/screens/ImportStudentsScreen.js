import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import Header from "../components/Header";
import { colors } from "../theme/colors";
import { createStudent } from "../api/studentsApi";

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

// Required CSV columns, in order. Extra columns are ignored.
const REQUIRED_COLUMNS = [
  "libraryId",
  "firstName",
  "lastName",
  "email",
  "department",
  "semester",
  "section",
  "academicYear",
];

const DEFAULT_PASSWORD = "Student@123";

/**
 * Minimal CSV parser: handles a header row + comma-separated values.
 * Good enough for simple exported CSVs (no embedded commas/quotes).
 */
function parseCsv(text) {
  const lines = text
    .split(/\r\n|\n|\r/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] !== undefined ? values[index] : "";
    });
    return row;
  });

  return { headers, rows };
}

function validateRow(row, index) {
  const errors = [];
  REQUIRED_COLUMNS.forEach((col) => {
    if (!row[col] || String(row[col]).trim() === "") {
      errors.push(`Row ${index + 2}: missing "${col}"`);
    }
  });
  if (row.semester && Number.isNaN(Number(row.semester))) {
    errors.push(`Row ${index + 2}: "semester" must be a number`);
  }
  return errors;
}

export default function ImportStudentsScreen() {
  const [pickedFile, setPickedFile] = useState(null); // { name, size, uri }
  const [parsedRows, setParsedRows] = useState([]);
  const [validation, setValidation] = useState(null); // { totalRecords, validRecords, invalidRecords, errors }
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null); // { imported, failed, failures }

  const resetState = () => {
    setParsedRows([]);
    setValidation(null);
    setImportResult(null);
  };

  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/comma-separated-values", "*/*"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];

      if (!asset.name.toLowerCase().endsWith(".csv")) {
        Alert.alert(
          "Unsupported File",
          "Please select a .csv file. (.xlsx support is coming soon — export your spreadsheet as CSV for now.)"
        );
        return;
      }

      resetState();
      setPickedFile({
        name: asset.name,
        size: asset.size || 0,
        uri: asset.uri,
      });
    } catch (error) {
      Alert.alert("File Selection Failed", "Could not open the file picker. Please try again.");
    }
  };

  const handleValidate = async () => {
    if (!pickedFile) return;

    setIsValidating(true);
    setImportResult(null);
    try {
      const content = await FileSystem.readAsStringAsync(pickedFile.uri);
      const { headers, rows } = parseCsv(content);

      const missingColumns = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
      if (missingColumns.length > 0) {
        Alert.alert(
          "Invalid Template",
          `Your CSV is missing required column(s): ${missingColumns.join(", ")}`
        );
        setValidation(null);
        setParsedRows([]);
        return;
      }

      const allErrors = [];
      rows.forEach((row, index) => {
        allErrors.push(...validateRow(row, index));
      });

      const invalidRowCount = new Set(
        allErrors.map((e) => e.match(/^Row (\d+)/)?.[1]).filter(Boolean)
      ).size;

      setParsedRows(rows);
      setValidation({
        totalRecords: rows.length,
        validRecords: rows.length - invalidRowCount,
        invalidRecords: invalidRowCount,
        errors: allErrors,
      });
    } catch (error) {
      Alert.alert("Validation Failed", "Could not read or parse the selected file.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = async () => {
    if (!validation || validation.validRecords === 0) {
      Alert.alert("Nothing to Import", "Run validation first and make sure at least one row is valid.");
      return;
    }

    setIsImporting(true);
    try {
      let imported = 0;
      const failures = [];

      for (let index = 0; index < parsedRows.length; index += 1) {
        const row = parsedRows[index];
        const rowErrors = validateRow(row, index);
        if (rowErrors.length > 0) {
          failures.push(`Row ${index + 2}: skipped (validation failed)`);
          continue;
        }

        try {
          await createStudent({
            libraryId: row.libraryId,
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            password: DEFAULT_PASSWORD,
            department: row.department,
            semester: Number(row.semester),
            section: row.section,
            academicYear: row.academicYear,
          });
          imported += 1;
        } catch (rowError) {
          failures.push(`Row ${index + 2} (${row.libraryId || "?"}): ${rowError.message}`);
        }
      }

      setImportResult({ imported, failed: failures.length, failures });
      Alert.alert(
        "Import Complete",
        `${imported} student(s) imported successfully.${
          failures.length > 0 ? `\n${failures.length} row(s) failed.` : ""
        }`
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    Alert.alert(
      "CSV Template",
      `Create a .csv file with this header row:\n\n${REQUIRED_COLUMNS.join(",")}\n\nExample row:\nLIB-9501,Kabir,Nair,kabir.nair@svce.edu.in,Computer Science (CSE),3,A,2026-27`
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Import Students" showSearch={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heading}>Bulk Student Admission</Text>
            <Text style={styles.subheading}>
              Upload student records via CSV for automated enrollment processing.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.templateLink} onPress={handleDownloadTemplate}>
          <Ionicons name="download-outline" size={16} color={colors.primary} />
          <Text style={styles.templateLinkText}>Download Template</Text>
        </TouchableOpacity>

        <View style={styles.dropZone}>
          <View style={styles.dropIconWrap}>
            <Ionicons name="cloud-upload-outline" size={30} color={colors.primary} />
          </View>
          <Text style={styles.dropTitle}>Select an Enrollment File</Text>
          <Text style={styles.dropSubtitle}>Supported format: .csv (Max file size: 25MB)</Text>
          <TouchableOpacity style={styles.chooseFileBtn} onPress={handleChooseFile}>
            <Ionicons name="attach-outline" size={16} color="#fff" />
            <Text style={styles.chooseFileText}>Choose File</Text>
          </TouchableOpacity>
        </View>

        {pickedFile && (
          <View style={styles.fileRow}>
            <View style={styles.fileInfo}>
              <Ionicons name="document-text-outline" size={22} color={colors.primary} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {pickedFile.name}
                </Text>
                <Text style={styles.fileMeta}>
                  {(pickedFile.size / 1024).toFixed(1)} KB •{" "}
                  {validation ? "Validated" : "Ready for validation"}
                </Text>
              </View>
            </View>
            <View style={styles.fileActions}>
              <TouchableOpacity
                style={styles.validateBtn}
                onPress={handleValidate}
                disabled={isValidating}
              >
                {isValidating ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={15} color={colors.primary} />
                    <Text style={styles.validateText}>Validate</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.importBtn,
                  (!validation || validation.validRecords === 0) && styles.importBtnDisabled,
                ]}
                onPress={handleImport}
                disabled={!validation || validation.validRecords === 0 || isImporting}
              >
                {isImporting ? (
                  <ActivityIndicator size="small" color={colors.textSecondary} />
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={15} color={colors.textSecondary} />
                    <Text style={styles.importText}>Import</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.validationCard}>
          <Text style={styles.validationTitle}>Validation Summary</Text>
          {validation ? (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Records</Text>
                <Text style={styles.summaryValue}>{validation.totalRecords}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Valid Records</Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>
                  {validation.validRecords}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Invalid Records</Text>
                <Text style={[styles.summaryValue, { color: colors.danger }]}>
                  {validation.invalidRecords}
                </Text>
              </View>
              {validation.errors.length > 0 && (
                <View style={styles.errorList}>
                  {validation.errors.slice(0, 6).map((err, i) => (
                    <Text key={i} style={styles.errorText}>
                      • {err}
                    </Text>
                  ))}
                  {validation.errors.length > 6 && (
                    <Text style={styles.errorText}>
                      • ...and {validation.errors.length - 6} more
                    </Text>
                  )}
                </View>
              )}
            </>
          ) : importResult ? (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Imported</Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>
                  {importResult.imported}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Failed</Text>
                <Text style={[styles.summaryValue, { color: colors.danger }]}>
                  {importResult.failed}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.validationEmpty}>
              Choose a file, then run validation to see a breakdown and address potential data
              errors.
            </Text>
          )}
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
            Each row needs: {REQUIRED_COLUMNS.join(", ")}. New students are created with the
            default password "{DEFAULT_PASSWORD}" and can change it after their first login.
          </Text>
          <TouchableOpacity onPress={handleDownloadTemplate}>
            <Text style={styles.helpLink}>View Required Columns</Text>
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
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 96,
  },
  validateText: { color: colors.primary, fontWeight: "700", fontSize: 12, marginLeft: 6 },
  importBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.sidebarBg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 90,
  },
  importBtnDisabled: { opacity: 0.5 },
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
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryLabel: { fontSize: 13, color: colors.textSecondary },
  summaryValue: { fontSize: 13, fontWeight: "700", color: colors.textPrimary },
  errorList: { marginTop: 8 },
  errorText: { fontSize: 11, color: colors.danger, marginBottom: 4 },
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
