import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme/colors";
import { getToken } from "../utils/authStorage";
import { API_BASE_URL } from "../config/apiConfig";


function FieldLabel({ children }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

function TextField({ label, value, onChangeText, placeholder, keyboardType }) {
  return (
    <View style={styles.fieldWrap}>
      <FieldLabel>{label}</FieldLabel>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function DropdownField({ label, value, onValueChange, options }) {
  return (
    <View style={styles.fieldWrap}>
      <FieldLabel>{label}</FieldLabel>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
          dropdownIconColor={colors.textSecondary}
        >
          <Picker.Item label={`Select ${label}`} value="" color={colors.placeholder} />
          {options.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

export default function AddStudentScreen() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    libraryId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    phone: "",
    email: "",
    academicYear: "",
    status: "",
    department: "",
    program: "",
    semester: "",
    section: "",
    admissionType: "",
  });

  const setField = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const token = await getToken();

      if (!token) {
        Alert.alert(
          "Not Logged In",
          "Your admin session was not found. Please log in again."
        );
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          libraryId: form.libraryId,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: "Student@123",
          department: form.department,
          semester: Number(form.semester),
          section: form.section,
          academicYear: form.academicYear,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const errorMessage =
          (result.errors && result.errors.join("\n")) ||
          result.message ||
          "Failed to save student record.";
        Alert.alert("Save Failed", errorMessage);
        return;
      }

      Alert.alert("Success", "Student record saved successfully.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Save Failed",
        "Could not connect to the server. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Add Student</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.breadcrumb}>Student Registry &gt; <Text style={styles.breadcrumbActive}>Add Student</Text></Text>
        <Text style={styles.heading}>Register New Student</Text>
        <Text style={styles.subheading}>
          Please fill in the student's personal and academic details to create a new profile.
        </Text>

        {/* Basic Information */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <Ionicons name="person-outline" size={16} color={colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Basic Information</Text>
          </View>

          <TextField
            label="Library ID"
            value={form.libraryId}
            onChangeText={setField("libraryId")}
            placeholder="Library ID"
          />

          <View style={styles.rowFields}>
            <View style={styles.rowFieldItem}>
              <TextField
                label="First Name"
                value={form.firstName}
                onChangeText={setField("firstName")}
                placeholder="First Name"
              />
            </View>
            <View style={styles.rowFieldItem}>
              <TextField
                label="Middle Name"
                value={form.middleName}
                onChangeText={setField("middleName")}
                placeholder="Middle Name"
              />
            </View>
          </View>

          <TextField
            label="Last Name"
            value={form.lastName}
            onChangeText={setField("lastName")}
            placeholder="Last Name"
          />

          <View style={styles.rowFields}>
            <View style={styles.rowFieldItem}>
              <DropdownField
                label="Gender"
                value={form.gender}
                onValueChange={setField("gender")}
                options={["Male", "Female", "Other"]}
              />
            </View>
            <View style={styles.rowFieldItem}>
              <TextField
                label="DOB"
                value={form.dob}
                onChangeText={setField("dob")}
                placeholder="mm/dd/yyyy"
              />
            </View>
          </View>

          <View style={styles.rowFields}>
            <View style={styles.rowFieldItem}>
              <DropdownField
                label="Blood Group"
                value={form.bloodGroup}
                onValueChange={setField("bloodGroup")}
                options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              />
            </View>
            <View style={styles.rowFieldItem}>
              <TextField
                label="Phone"
                value={form.phone}
                onChangeText={setField("phone")}
                placeholder="Phone"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <TextField
            label="Email Address"
            value={form.email}
            onChangeText={setField("email")}
            placeholder="Email Address"
            keyboardType="email-address"
          />
        </View>

        {/* Academic Information */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <Ionicons name="school-outline" size={16} color={colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Academic Information</Text>
          </View>

          <View style={styles.rowFields}>
            <View style={styles.rowFieldItem}>
              <DropdownField
                label="Academic Year"
                value={form.academicYear}
                onValueChange={setField("academicYear")}
                options={["2023-2024", "2024-2025", "2025-2026", "2026-2027"]}
              />
            </View>
            <View style={styles.rowFieldItem}>
              <DropdownField
                label="Status"
                value={form.status}
                onValueChange={setField("status")}
                options={["Active", "Inactive", "Pending USN"]}
              />
            </View>
          </View>

          <DropdownField
            label="Department"
            value={form.department}
            onValueChange={setField("department")}
            options={["Computer Science (CSE)", "Electronics (ECE)", "Mechanical", "Civil"]}
          />

          <DropdownField
            label="Program"
            value={form.program}
            onValueChange={setField("program")}
            options={["B.E.", "M.Tech", "Ph.D"]}
          />

          <View style={styles.rowFields}>
            <View style={styles.rowFieldItem}>
              <DropdownField
                label="Semester"
                value={form.semester}
                onValueChange={setField("semester")}
                options={["1", "2", "3", "4", "5", "6", "7", "8"]}
              />
            </View>
            <View style={styles.rowFieldItem}>
              <TextField
                label="Section"
                value={form.section}
                onChangeText={setField("section")}
                placeholder="Section"
              />
            </View>
          </View>

          <DropdownField
            label="Admission Type"
            value={form.admissionType}
            onValueChange={setField("admissionType")}
            options={["Regular", "Lateral Entry", "Management Quota"]}
          />

          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>Notice:</Text>
            <Text style={styles.noticeBody}>
              Ensure Library ID is unique. Since USN is not assigned at this stage, it will be
              generated and linked to this profile later in the admission workflow.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveContinueBtn}>
          <Text style={styles.saveContinueText}>Save & Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
          <Text style={styles.saveText}>{isSaving ? "Saving..." : "Save Student Record"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  breadcrumb: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  breadcrumbActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subheading: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 18,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  fieldWrap: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.labelBlue,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: colors.textPrimary,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    justifyContent: "center",
    height: 44,
    overflow: "hidden",
  },
  picker: {
    color: colors.textPrimary,
    ...Platform.select({
      android: { height: 44 },
      ios: {},
    }),
  },
  rowFields: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowFieldItem: {
    flex: 1,
    marginRight: 10,
  },
  notice: {
    backgroundColor: colors.noticeBg,
    borderLeftWidth: 3,
    borderLeftColor: colors.noticeBorder,
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  noticeBody: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  saveContinueBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveContinueText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
});