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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { colors } from "../theme/colors";
import { getLowAttendance } from "../api/attendanceApi";

const DEPARTMENTS = [
  "All",
  "Computer Science (CSE)",
  "Mechanical",
  "Electronics (ECE)",
  "Information Science (ISE)",
  "Civil",
];

export default function LowAttendanceScreen({ navigation }) {
  const [selectedDept, setSelectedDept] = useState("All");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchLowAttendance = useCallback(async () => {
    try {
      setError(null);
      const params = { threshold: 75 };
      if (selectedDept !== "All") {
        params.department = selectedDept;
      }
      const data = await getLowAttendance(params);
      setStudents(data || []);
    } catch (err) {
      console.error("Failed to fetch low attendance:", err);
      setError(err.message || "Failed to load low attendance list.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedDept]);

  useEffect(() => {
    fetchLowAttendance();
  }, [fetchLowAttendance]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchLowAttendance();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Header title="Low Attendance Alert" showSearch={false} />

      {/* Filter by Department */}
      <View style={styles.filterWrap}>
        <Text style={styles.filterLabel}>Filter by Department</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {DEPARTMENTS.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <TouchableOpacity
                key={dept}
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                onPress={() => setSelectedDept(dept)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextSelected,
                  ]}
                >
                  {dept}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Threshold Warning Banner */}
      <View style={styles.warningBanner}>
        <Ionicons name="warning-outline" size={20} color={colors.danger} />
        <View style={styles.warningTextWrap}>
          <Text style={styles.warningTitle}>Attendance Shortage Criteria</Text>
          <Text style={styles.warningDesc}>
            Students below 75% attendance are ineligible for semester examinations under university regulations.
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.stateText}>Scanning attendance records...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={styles.errorTitle}>Error Loading Records</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchLowAttendance}>
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
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              Students Below 75% ({students.length})
            </Text>
          </View>

          {students.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons
                name="checkmark-circle-outline"
                size={48}
                color={colors.success}
              />
              <Text style={styles.emptyTitle}>All Students Clear</Text>
              <Text style={styles.emptySub}>
                No students in {selectedDept === "All" ? "any department" : selectedDept} are currently below 75% attendance.
              </Text>
            </View>
          ) : (
            students.map((student) => {
              const pct = student.attendance_percentage || 0;
              const attended = student.present_classes || 0;
              const total = student.total_classes || 0;

              return (
                <View key={student.id} style={styles.studentCard}>
                  <View style={styles.cardTop}>
                    <View style={styles.avatarWrap}>
                      <Text style={styles.avatarText}>
                        {student.first_name?.[0]}
                        {student.last_name?.[0]}
                      </Text>
                    </View>

                    <View style={styles.infoCol}>
                      <Text style={styles.studentName}>
                        {student.first_name} {student.last_name}
                      </Text>
                      <Text style={styles.studentSub}>
                        ID: {student.library_id} · {student.department}
                      </Text>
                      <Text style={styles.studentMeta}>
                        USN: {student.usn || "Pending"} · Sem {student.semester}-{student.section}
                      </Text>
                    </View>

                    <View style={styles.pctBadge}>
                      <Text style={styles.pctText}>{pct}%</Text>
                      <Text style={styles.pctLabel}>Overall</Text>
                    </View>
                  </View>

                  {/* Progress Bar in red */}
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(pct, 100)}%` },
                      ]}
                    />
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.footerText}>
                      Attended {attended} of {total} classes held
                    </Text>
                    <View style={styles.shortagePill}>
                      <Text style={styles.shortageText}>
                        Shortage: {75 - pct > 0 ? `${(75 - pct).toFixed(1)}%` : "Critical"}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  filterWrap: {
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: colors.sidebarBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  filterChipTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.dangerBg,
    borderRadius: 10,
    padding: 12,
    margin: 16,
    marginBottom: 8,
    gap: 10,
  },
  warningTextWrap: { flex: 1 },
  warningTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.danger,
    marginBottom: 2,
  },
  warningDesc: {
    fontSize: 11,
    color: colors.danger,
    lineHeight: 16,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 8, paddingBottom: 32 },
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
  sectionHeaderRow: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  studentCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dangerBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.danger,
  },
  infoCol: { flex: 1 },
  studentName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  studentSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  studentMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  pctBadge: {
    alignItems: "center",
    backgroundColor: colors.dangerBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  pctText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.danger,
  },
  pctLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: colors.danger,
    marginTop: 1,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: "hidden",
    marginVertical: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.danger,
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  shortagePill: {
    backgroundColor: colors.sidebarBg,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  shortageText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.danger,
  },
  emptyCard: {
    backgroundColor: colors.sidebarBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 32,
    alignItems: "center",
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
});
