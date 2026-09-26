import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import { colors } from "../theme/colors";
import { getDashboardStats } from "../api/statsApi";

// Every number on this screen comes from GET /api/admin/stats (real
// PostgreSQL data). There is no hardcoded/mock statistic anywhere here -
// if the backend call fails, the screen shows an error, not a fallback
// fake number.

const formatInr = (value) => `₹${Math.round(Number(value || 0)).toLocaleString("en-IN")}`;

// Shortens a long department name for the progress-bar rows, e.g.
// "Computer Science (CSE)" -> "CSE".
const shortDept = (name = "") => {
  const match = name.match(/\(([^)]+)\)/);
  return match ? match[1] : name;
};

function StatCard({ icon, label, value, tint }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: tint.bg }]}>
        <Ionicons name={icon} size={18} color={tint.color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ProgressRow({ label, count, percentOfMax, color }) {
  return (
    <View style={styles.progressRow}>
      <View style={styles.progressLabelRow}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressCount}>{count}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentOfMax}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
      setError(err.message || "Failed to load dashboard.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchStats();
  };

  const deptCounts = stats?.students?.byDepartment || [];
  const deptAttendance = stats?.attendance?.byDepartment || [];
  const maxDeptCount = Math.max(1, ...deptCounts.map((d) => d.count));
  const fees = stats?.fees;
  const feeCollectedPct = fees && fees.totalAmount > 0 ? Math.round((fees.totalPaid / fees.totalAmount) * 100) : 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Dashboard" showSearch={false} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={styles.errorTitle}>Could not load dashboard</Text>
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchStats}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
        >
          <Text style={styles.welcome}>Welcome back, Admin</Text>
          <Text style={styles.subWelcome}>Sri Venkateshwara College of Engineering — Academic Management</Text>

          <View style={styles.statGrid}>
            <StatCard icon="people" label="Total Students" value={String(stats.students.total)} tint={{ color: colors.primary, bg: colors.primaryLight }} />
            <StatCard icon="checkmark-circle" label="Active" value={String(stats.students.active)} tint={{ color: colors.success, bg: colors.successBg }} />
            <StatCard icon="close-circle" label="Suspended" value={String(stats.students.suspended)} tint={{ color: colors.danger, bg: colors.dangerBg }} />
            <StatCard icon="calendar" label="Avg Attendance" value={`${stats.attendance.overallPercentage}%`} tint={{ color: colors.info, bg: colors.infoBg }} />
          </View>

          <View style={styles.sectionHeaderRow}>
            <Ionicons name="business-outline" size={16} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>Students by Department</Text>
          </View>
          <View style={styles.card}>
            {deptCounts.length === 0 ? (
              <Text style={styles.emptyText}>No students yet.</Text>
            ) : (
              deptCounts.map((dep) => (
                <ProgressRow
                  key={dep.department}
                  label={shortDept(dep.department)}
                  count={dep.count}
                  percentOfMax={(dep.count / maxDeptCount) * 100}
                  color={colors.primary}
                />
              ))
            )}
          </View>

          <View style={styles.sectionHeaderRow}>
            <Ionicons name="stats-chart-outline" size={16} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>Attendance by Department</Text>
          </View>
          <View style={styles.card}>
            {deptAttendance.length === 0 ? (
              <Text style={styles.emptyText}>No attendance recorded yet.</Text>
            ) : (
              deptAttendance.map((dep) => (
                <ProgressRow
                  key={dep.department}
                  label={shortDept(dep.department)}
                  count={`${dep.percentage}%`}
                  percentOfMax={dep.percentage}
                  color={dep.percentage < 75 ? colors.danger : colors.success}
                />
              ))
            )}
          </View>

          <View style={styles.sectionHeaderRow}>
            <Ionicons name="cash-outline" size={16} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>Fee Collection</Text>
          </View>
          <View style={styles.card}>
            {!fees || fees.totalAmount === 0 ? (
              <Text style={styles.emptyText}>No fee records yet.</Text>
            ) : (
              <>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${feeCollectedPct}%`, backgroundColor: colors.success }]} />
                </View>
                <View style={styles.feeRow}>
                  <View style={styles.feeCol}>
                    <Text style={styles.feeLabel}>Total</Text>
                    <Text style={styles.feeValue}>{formatInr(fees.totalAmount)}</Text>
                  </View>
                  <View style={styles.feeCol}>
                    <Text style={styles.feeLabel}>Collected</Text>
                    <Text style={[styles.feeValue, { color: colors.success }]}>{formatInr(fees.totalPaid)}</Text>
                  </View>
                  <View style={styles.feeCol}>
                    <Text style={styles.feeLabel}>Due</Text>
                    <Text style={[styles.feeValue, { color: colors.danger }]}>{formatInr(fees.totalDue)}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  stateText: { color: colors.textSecondary, marginTop: 10, textAlign: "center" },
  errorTitle: { fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginTop: 8 },
  retryBtn: { marginTop: 14, paddingHorizontal: 22, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.primary },
  retryText: { color: "#FFFFFF", fontWeight: "600" },
  welcome: { fontSize: 18, fontWeight: "700", color: colors.textPrimary, marginTop: 4 },
  subWelcome: { fontSize: 13, color: colors.textSecondary, marginTop: 4, marginBottom: 18 },
  statGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  statCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  statIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  statValue: { fontSize: 22, fontWeight: "800", color: colors.textPrimary },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", marginTop: 12, marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.textPrimary, marginLeft: 8 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16 },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: "center", paddingVertical: 10 },
  progressRow: { marginBottom: 14 },
  progressLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  progressLabel: { fontSize: 13, fontWeight: "600", color: colors.textPrimary },
  progressCount: { fontSize: 12, fontWeight: "700", color: colors.textSecondary },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: colors.sidebarBg, overflow: "hidden" },
  progressFill: { height: 8, borderRadius: 4 },
  feeRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  feeCol: { alignItems: "center", flex: 1 },
  feeLabel: { fontSize: 11, color: colors.textSecondary },
  feeValue: { fontSize: 14, fontWeight: "700", color: colors.textPrimary, marginTop: 3 },
});
