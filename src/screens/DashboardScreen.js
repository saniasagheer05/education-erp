import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { colors } from "../theme/colors";
import { mockDepartmentCounts } from "../data/mockStudents";

const STATS = [
  { label: "Total Students", value: "1,452", icon: "people-outline" },
  { label: "Active", value: "1,401", icon: "checkmark-circle-outline" },
  { label: "Pending USN", value: "9", icon: "time-outline" },
  { label: "Transferred", value: "12", icon: "swap-horizontal-outline" },
];

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Dashboard" showSearch={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcome}>Welcome back, Admin</Text>
        <Text style={styles.subWelcome}>
          Sri Venkateshwara College of Engineering — Academic Management
        </Text>

        <View style={styles.statGrid}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Ionicons name={stat.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Students by Department</Text>
        <View style={styles.card}>
          {mockDepartmentCounts.map((dep, index) => (
            <View
              key={dep.label}
              style={[
                styles.depRow,
                index !== mockDepartmentCounts.length - 1 && styles.depRowBorder,
              ]}
            >
              <Text style={styles.depLabel}>{dep.label}</Text>
              <Text style={styles.depValue}>{dep.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  welcome: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 4,
  },
  subWelcome: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  depRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  depRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  depLabel: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  depValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
});
