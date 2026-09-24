import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import StudentHeader from "../../components/StudentHeader";
import {
  getStudentProfile,
  getStudentAttendance,
  getStudentFees,
  getStudentTimetable,
} from "../../api/studentPortalApi";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function StudentHomeScreen({ navigation }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [fees, setFees] = useState([]);
  const [todayClasses, setTodayClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [profileData, attendanceData, feesData, timetableData] =
        await Promise.all([
          getStudentProfile().catch(() => null),
          getStudentAttendance().catch(() => null),
          getStudentFees().catch(() => []),
          getStudentTimetable().catch(() => []),
        ]);

      setProfile(profileData);
      setAttendance(attendanceData);
      setFees(feesData || []);

      const currentDay = DAYS[new Date().getDay()];
      const todayList = (timetableData || [])
        .filter((t) => t.day_of_week === currentDay)
        .sort((a, b) => a.period_number - b.period_number);
      setTodayClasses(todayList);
    } catch (err) {
      console.error("Failed to load student home data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  // Compute aggregate attendance
  const overallPercentage = (() => {
    if (!attendance?.summary || attendance.summary.length === 0) return null;
    const totalClasses = attendance.summary.reduce(
      (sum, s) => sum + parseInt(s.total_classes || 0, 10),
      0
    );
    const presentClasses = attendance.summary.reduce(
      (sum, s) => sum + parseInt(s.present_count || 0, 10),
      0
    );
    if (totalClasses === 0) return 0;
    return Math.round((presentClasses / totalClasses) * 100);
  })();

  // Compute fees total due
  const totalDueAmount = fees.reduce(
    (sum, f) => sum + parseFloat(f.due_amount || 0),
    0
  );
  const totalPaidAmount = fees.reduce(
    (sum, f) => sum + parseFloat(f.paid_amount || 0),
    0
  );

  return (
    <View style={styles.container}>
      <StudentHeader
        title="Student Portal"
        subtitle={profile?.department ? `${profile.department} · Sem ${profile.semester}-${profile.section}` : "Dashboard"}
      />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.stateText}>Loading your dashboard...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={styles.errorTitle}>Could not load dashboard</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadData}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {/* Welcome Card */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeRow}>
              <View style={styles.welcomeTextWrap}>
                <Text style={styles.welcomeGreeting}>Welcome back,</Text>
                <Text style={styles.welcomeName}>
                  {profile
                    ? `${profile.first_name} ${profile.last_name}`
                    : user?.name || "Student"}
                </Text>
                <View style={styles.badgeRow}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>
                      ID: {profile?.library_id || user?.libraryId || "—"}
                    </Text>
                  </View>
                  {profile?.usn ? (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>USN: {profile.usn}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={28} color={colors.primary} />
              </View>
            </View>
          </View>

          {/* Quick Metrics */}
          <View style={styles.metricsRow}>
            {/* Attendance Metric */}
            <TouchableOpacity
              style={styles.metricCard}
              onPress={() => navigation.navigate("Attendance")}
            >
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>Attendance</Text>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={
                    overallPercentage !== null && overallPercentage < 75
                      ? colors.danger
                      : colors.primary
                  }
                />
              </View>
              <Text
                style={[
                  styles.metricValue,
                  overallPercentage !== null && overallPercentage < 75
                    ? { color: colors.danger }
                    : { color: colors.textPrimary },
                ]}
              >
                {overallPercentage !== null ? `${overallPercentage}%` : "N/A"}
              </Text>
              <Text style={styles.metricHint}>
                {overallPercentage !== null && overallPercentage < 75
                  ? "⚠ Below 75% required"
                  : "View subject breakdown →"}
              </Text>
            </TouchableOpacity>

            {/* Fees Metric */}
            <TouchableOpacity
              style={styles.metricCard}
              onPress={() => navigation.navigate("Fees")}
            >
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>Fee Dues</Text>
                <Ionicons
                  name="card-outline"
                  size={18}
                  color={totalDueAmount > 0 ? colors.warning : colors.success}
                />
              </View>
              <Text
                style={[
                  styles.metricValue,
                  totalDueAmount > 0
                    ? { color: colors.warning }
                    : { color: colors.success },
                ]}
              >
                {totalDueAmount > 0
                  ? `₹${totalDueAmount.toLocaleString()}`
                  : "All Paid"}
              </Text>
              <Text style={styles.metricHint}>
                {totalDueAmount > 0 ? "Outstanding balance →" : "No dues pending →"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Today's Schedule */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Classes</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Timetable")}>
              <Text style={styles.seeAllText}>Full Schedule →</Text>
            </TouchableOpacity>
          </View>

          {todayClasses.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons
                name="cafe-outline"
                size={36}
                color={colors.textMuted}
              />
              <Text style={styles.emptyCardTitle}>No classes today</Text>
              <Text style={styles.emptyCardSub}>
                Enjoy your free day or prepare for upcoming sessions.
              </Text>
            </View>
          ) : (
            todayClasses.map((item) => (
              <View key={item.id} style={styles.classCard}>
                <View style={styles.classPeriod}>
                  <Text style={styles.classPeriodNum}>P{item.period_number}</Text>
                  <Text style={styles.classTime}>
                    {item.start_time?.slice(0, 5)} - {item.end_time?.slice(0, 5)}
                  </Text>
                </View>
                <View style={styles.classInfo}>
                  <Text style={styles.classSubject}>{item.subject}</Text>
                  <Text style={styles.classFaculty}>
                    {item.faculty_name} {item.room_number ? `· ${item.room_number}` : ""}
                  </Text>
                </View>
              </View>
            ))
          )}

          {/* Quick Actions */}
          <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>
            Quick Actions
          </Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate("Attendance")}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: colors.infoBg }]}>
                <Ionicons name="bar-chart-outline" size={20} color={colors.info} />
              </View>
              <Text style={styles.actionBtnText}>Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate("Fees")}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: colors.warningBg }]}>
                <Ionicons name="receipt-outline" size={20} color={colors.warning} />
              </View>
              <Text style={styles.actionBtnText}>Fee Records</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate("Timetable")}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="time-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.actionBtnText}>Timetable</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate("Profile")}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: colors.successBg }]}>
                <Ionicons name="person-outline" size={20} color={colors.success} />
              </View>
              <Text style={styles.actionBtnText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  stateText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 12,
  },
  errorDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  welcomeCard: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeTextWrap: { flex: 1 },
  welcomeGreeting: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
  },
  welcomeName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 4,
  },
  metricHint: {
    fontSize: 11,
    color: colors.textMuted,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  emptyCard: {
    backgroundColor: colors.sidebarBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: "center",
  },
  emptyCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 10,
  },
  emptyCardSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  classCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  classPeriod: {
    width: 90,
    borderRightWidth: 1,
    borderRightColor: colors.borderLight,
    paddingRight: 8,
  },
  classPeriodNum: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  classTime: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  classInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  classSubject: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  classFaculty: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionGrid: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
