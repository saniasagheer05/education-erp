import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../theme/colors";
import StatusBadge from "../components/StatusBadge";

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "—"}</Text>
    </View>
  );
}

export default function StudentDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { student } = route.params;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Student Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{student.initials}</Text>
          </View>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.usn}>USN: {student.usn}</Text>
          <StatusBadge status={student.status} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Academic Details</Text>
          <InfoRow label="Library ID" value={student.libraryId} />
          <InfoRow label="Department" value={student.dept} />
          <InfoRow label="Academic Year" value={student.academicYear} />
          <InfoRow label="Semester" value={student.sem} />
          <InfoRow label="Section" value={student.section} />
        </View>
      </ScrollView>
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
  topBarTitle: { fontSize: 16, fontWeight: "700", color: colors.textPrimary },
  content: { padding: 16 },
  heroCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { color: colors.primary, fontWeight: "700", fontSize: 20 },
  name: { fontSize: 17, fontWeight: "700", color: colors.textPrimary },
  usn: { fontSize: 13, color: colors.primary, marginTop: 4, marginBottom: 10 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.textPrimary, marginBottom: 10 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: { fontSize: 13, color: colors.textSecondary },
  infoValue: { fontSize: 13, fontWeight: "600", color: colors.textPrimary },
});
