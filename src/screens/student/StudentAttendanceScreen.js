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
import StudentHeader from "../../components/StudentHeader";
import { getStudentAttendance } from "../../api/studentPortalApi";

export default function StudentAttendanceScreen() {
  const [data, setData] = useState({ records: [], summary: [] });
  const [activeTab, setActiveTab] = useState("summary"); // "summary" | "records"
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAttendance = useCallback(async () => {
    try {
      setError(null);
      const res = await getStudentAttendance();
      setData({
        records: res?.records || [],
        summary: res?.summary || [],
      });
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
      setError(err.message || "Failed to load attendance records");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchAttendance();
  };

  // Compute aggregate numbers
  const totalClasses = data.summary.reduce(
    (acc, s) => acc + parseInt(s.total_classes || 0, 10),
    0
  );
  const presentCount = data.summary.reduce(
    (acc, s) => acc + parseInt(s.present_count || 0, 10),
    0
  );
  const absentCount = totalClasses - presentCount;
  const overallPercentage =
    totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  const getPercentageColor = (pct) => {
    if (pct < 75) return colors.danger;
    if (pct < 85) return colors.warning;
    return colors.success;
  };

  const getPercentageBg = (pct) => {
    if (pct < 75) return colors.dangerBg;
    if (pct < 85) return colors.warningBg;
    return colors.successBg;
  };

  return (
    <View style={styles.container}>
      <StudentHeader
        title="My Attendance"
        subtitle="Current semester records"
      />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.stateText}>Loading attendance data...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={styles.errorTitle}>Could not load attendance</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchAttendance}>
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
          {/* Overall Overview Banner */}
          <View
            style={[
              styles.overviewBanner,
              { borderColor: getPercentageColor(overallPercentage) },
            ]}
          >
            <View style={styles.overviewTop}>
              <View>
                <Text style={styles.overviewLabel}>Overall Attendance</Text>
                <Text
                  style={[
                    styles.overviewValue,
                    { color: getPercentageColor(overallPercentage) },
                  ]}
                >
                  {overallPercentage}%
                </Text>
              </View>

              <View
                style={[
                  styles.badgePill,
                  { backgroundColor: getPercentageBg(overallPercentage) },
                ]}
              >
                <Text
                  style={[
                    styles.badgePillText,
                    { color: getPercentageColor(overallPercentage) },
                  ]}
                >
                  {overallPercentage >= 75 ? "Eligible" : "Shortage"}
                </Text>
              </View>
            </View>

            {/* Overall Progress Bar */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(overallPercentage, 100)}%`,
                    backgroundColor: getPercentageColor(overallPercentage),
                  },
                ]}
              />
            </View>

            <View style={styles.overviewStatsRow}>
              <View style={styles.statCol}>
                <Text style={styles.statNum}>{totalClasses}</Text>
                <Text style={styles.statLabel}>Total Classes</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Text style={[styles.statNum, { color: colors.success }]}>
                  {presentCount}
                </Text>
                <Text style={styles.statLabel}>Attended</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Text style={[styles.statNum, { color: colors.danger }]}>
                  {absentCount}
                </Text>
                <Text style={styles.statLabel}>Missed</Text>
              </View>
            </View>

            {overallPercentage < 75 && (
              <View style={styles.warningBox}>
                <Ionicons name="warning-outline" size={16} color={colors.danger} />
                <Text style={styles.warningText}>
                  Attendance is below the mandatory 75% threshold. Please attend upcoming lectures.
                </Text>
              </View>
            )}
          </View>

          {/* Tab Selector */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === "summary" && styles.tabBtnActive]}
              onPress={() => setActiveTab("summary")}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === "summary" && styles.tabBtnTextActive,
                ]}
              >
                Subject Breakdown ({data.summary.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === "records" && styles.tabBtnActive]}
              onPress={() => setActiveTab("records")}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === "records" && styles.tabBtnTextActive,
                ]}
              >
                Daily Logs ({data.records.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* TAB 1: SUBJECT BREAKDOWN */}
          {activeTab === "summary" && (
            <View style={styles.sectionWrap}>
              {data.summary.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="document-text-outline" size={36} color={colors.textMuted} />
                  <Text style={styles.emptyTitle}>No attendance records found</Text>
                  <Text style={styles.emptySub}>
                    Attendance summaries will appear once faculty records classes.
                  </Text>
                </View>
              ) : (
                data.summary.map((item, idx) => {
                  const pct = Math.round(parseFloat(item.attendance_percentage || 0));
                  const color = getPercentageColor(pct);
                  const isLow = pct < 75;

                  return (
                    <View key={idx} style={styles.subjectCard}>
                      <View style={styles.subjectCardHeader}>
                        <View style={styles.subjectTitleWrap}>
                          <Text style={styles.subjectName}>{item.subject}</Text>
                          <Text style={styles.subjectCounts}>
                            {item.present_count} / {item.total_classes} classes attended
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.subjectPctBadge,
                            { backgroundColor: getPercentageBg(pct) },
                          ]}
                        >
                          <Text style={[styles.subjectPctText, { color }]}>
                            {pct}%
                          </Text>
                        </View>
                      </View>

                      {/* Colored progress bar */}
                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(pct, 100)}%`,
                              backgroundColor: color,
                            },
                          ]}
                        />
                      </View>

                      {isLow && (
                        <View style={styles.lowNotice}>
                          <Ionicons name="alert-circle" size={14} color={colors.danger} />
                          <Text style={styles.lowNoticeText}>
                            Requires attention: Below 75%
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* TAB 2: DAILY LOGS */}
          {activeTab === "records" && (
            <View style={styles.sectionWrap}>
              {data.records.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="calendar-outline" size={36} color={colors.textMuted} />
                  <Text style={styles.emptyTitle}>No attendance logs recorded</Text>
                  <Text style={styles.emptySub}>
                    Daily class-by-class marks will be listed here.
                  </Text>
                </View>
              ) : (
                data.records.map((rec) => {
                  const isPresent = rec.status === "Present";
                  const isLate = rec.status === "Late";
                  const isAbsent = rec.status === "Absent";
                  const dateStr = rec.attendance_date
                    ? new Date(rec.attendance_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—";

                  let badgeColor = colors.success;
                  let badgeBg = colors.successBg;
                  if (isAbsent) {
                    badgeColor = colors.danger;
                    badgeBg = colors.dangerBg;
                  } else if (isLate) {
                    badgeColor = colors.warning;
                    badgeBg = colors.warningBg;
                  } else if (rec.status === "Excused") {
                    badgeColor = colors.info;
                    badgeBg = colors.infoBg;
                  }

                  return (
                    <View key={rec.id} style={styles.logCard}>
                      <View style={styles.logInfo}>
                        <Text style={styles.logSubject}>{rec.subject}</Text>
                        <Text style={styles.logDate}>{dateStr}</Text>
                      </View>
                      <View
                        style={[
                          styles.logStatusBadge,
                          { backgroundColor: badgeBg },
                        ]}
                      >
                        <Text style={[styles.logStatusText, { color: badgeColor }]}>
                          {rec.status}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
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
  stateText: { marginTop: 12, fontSize: 14, color: colors.textSecondary },
  errorTitle: { fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginTop: 12 },
  errorDesc: { fontSize: 13, color: colors.textSecondary, textAlign: "center", marginTop: 6, marginBottom: 16 },
  retryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  overviewBanner: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  overviewTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  overviewLabel: { fontSize: 13, fontWeight: "600", color: colors.textSecondary },
  overviewValue: { fontSize: 32, fontWeight: "800", marginTop: 2 },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePillText: { fontSize: 12, fontWeight: "700" },
  progressTrack: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: "hidden",
    marginVertical: 12,
  },
  progressFill: { height: "100%", borderRadius: 4 },
  overviewStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statCol: { flex: 1, alignItems: "center" },
  statDivider: { width: 1, height: 28, backgroundColor: colors.borderLight },
  statNum: { fontSize: 16, fontWeight: "700", color: colors.textPrimary },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dangerBg,
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: colors.danger,
    lineHeight: 16,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.sidebarBg,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  tabBtnActive: {
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  tabBtnTextActive: {
    color: colors.primary,
  },
  sectionWrap: { gap: 10 },
  subjectCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
  },
  subjectCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subjectTitleWrap: { flex: 1 },
  subjectName: { fontSize: 15, fontWeight: "700", color: colors.textPrimary },
  subjectCounts: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  subjectPctBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  subjectPctText: { fontSize: 13, fontWeight: "700" },
  lowNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  lowNoticeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.danger,
  },
  logCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
  },
  logInfo: { flex: 1 },
  logSubject: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  logDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  logStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  logStatusText: { fontSize: 11, fontWeight: "700" },
  emptyCard: {
    backgroundColor: colors.sidebarBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 28,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
});
