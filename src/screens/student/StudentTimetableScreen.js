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
import { getStudentTimetable } from "../../api/studentPortalApi";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function StudentTimetableScreen() {
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Set today by default
  useEffect(() => {
    const todayIndex = new Date().getDay();
    // getDay: 0 is Sunday, 1 is Monday ... 6 is Saturday
    if (todayIndex >= 1 && todayIndex <= 6) {
      setSelectedDay(WEEKDAYS[todayIndex - 1]);
    } else {
      setSelectedDay("Monday");
    }
  }, []);

  const fetchTimetable = useCallback(async () => {
    try {
      setError(null);
      const res = await getStudentTimetable();
      setTimetable(res || []);
    } catch (err) {
      console.error("Failed to fetch timetable:", err);
      setError(err.message || "Failed to load class timetable");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchTimetable();
  };

  // Filter and sort for currently selected day
  const dayClasses = timetable
    .filter((entry) => entry.day_of_week === selectedDay)
    .sort((a, b) => a.period_number - b.period_number);

  return (
    <View style={styles.container}>
      <StudentHeader
        title="Weekly Schedule"
        subtitle="Department & section timetable"
      />

      {/* Weekday Selector Pills */}
      <View style={styles.daysScrollWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysScroll}
        >
          {WEEKDAYS.map((day) => {
            const isSelected = selectedDay === day;
            const count = timetable.filter((t) => t.day_of_week === day).length;
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayPill,
                  isSelected && styles.dayPillSelected,
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={[
                    styles.dayPillText,
                    isSelected && styles.dayPillTextSelected,
                  ]}
                >
                  {day.slice(0, 3)}
                </Text>
                <View
                  style={[
                    styles.countDot,
                    isSelected && styles.countDotSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isSelected && styles.countTextSelected,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.stateText}>Loading schedule...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={styles.errorTitle}>Could not load timetable</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchTimetable}>
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
          <View style={styles.dayHeaderRow}>
            <Text style={styles.dayHeaderTitle}>{selectedDay}</Text>
            <Text style={styles.dayHeaderCount}>
              {dayClasses.length} {dayClasses.length === 1 ? "class" : "classes"} scheduled
            </Text>
          </View>

          {dayClasses.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="sunny-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No classes scheduled</Text>
              <Text style={styles.emptySub}>
                There are no lectures scheduled for {selectedDay}.
              </Text>
            </View>
          ) : (
            dayClasses.map((item) => {
              const startStr = item.start_time?.slice(0, 5) || "00:00";
              const endStr = item.end_time?.slice(0, 5) || "00:00";

              return (
                <View key={item.id} style={styles.classCard}>
                  <View style={styles.periodCol}>
                    <Text style={styles.periodTag}>Period {item.period_number}</Text>
                    <Text style={styles.timeTag}>{startStr} - {endStr}</Text>
                  </View>

                  <View style={styles.classDivider} />

                  <View style={styles.classDetails}>
                    <Text style={styles.subjectName}>{item.subject}</Text>
                    <View style={styles.facultyRow}>
                      <Ionicons
                        name="person-outline"
                        size={14}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.facultyName}>
                        {item.faculty_name || "Faculty not assigned"}
                      </Text>
                    </View>

                    {item.room_number ? (
                      <View style={styles.roomRow}>
                        <Ionicons
                          name="location-outline"
                          size={14}
                          color={colors.primary}
                        />
                        <Text style={styles.roomText}>Room: {item.room_number}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  daysScrollWrap: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
  },
  daysScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dayPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.sidebarBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  dayPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  dayPillTextSelected: {
    color: "#fff",
  },
  countDot: {
    backgroundColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  countDotSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  countText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  countTextSelected: {
    color: "#fff",
  },
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
  dayHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dayHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  dayHeaderCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  classCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  periodCol: {
    width: 95,
    justifyContent: "center",
  },
  periodTag: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  timeTag: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  classDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: 12,
  },
  classDetails: {
    flex: 1,
    justifyContent: "center",
  },
  subjectName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  facultyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  facultyName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  roomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  roomText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.primary,
  },
  emptyCard: {
    backgroundColor: colors.sidebarBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 32,
    alignItems: "center",
    marginTop: 12,
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
