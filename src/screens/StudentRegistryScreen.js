import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { colors } from "../theme/colors";
import { listStudents } from "../api/studentsApi";
import { mapApiStudentToCard } from "../utils/mapStudent";
import StudentCard from "../components/StudentCard";

export default function StudentRegistryScreen() {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]); // real API data, mapped for the card UI
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // all | active | suspended
  // "asc" = A-Z, "desc" = Z-A. A visible toggle button flips this directly
  // (no hidden menu) and re-sorts immediately.
  const [sortDirection, setSortDirection] = useState("asc");

  const loadStudents = useCallback(async () => {
    try {
      setError(null);
      const data = await listStudents();
      setStudents(data.map(mapApiStudentToCard));
    } catch (err) {
      console.error("Failed to load students:", err);
      setError(err.message || "Could not load students.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Refresh whenever this tab regains focus, so a newly added/transferred
  // student, or a status change made elsewhere, shows up right away.
  useFocusEffect(
    useCallback(() => {
      loadStudents();
    }, [loadStudents])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    loadStudents();
  };

  // Real counts, computed straight from whatever the API just returned -
  // never a fixed number.
  const counts = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === "Active").length;
    const suspended = students.filter((s) => s.status === "Suspended").length;
    return { total, active, suspended };
  }, [students]);

  const FILTERS = [
    { key: "all", label: "All Students", count: counts.total },
    { key: "active", label: "Active", count: counts.active },
    { key: "suspended", label: "Suspended", count: counts.suspended },
  ];

  const visibleStudents = useMemo(() => {
    let list = students;

    if (activeFilter === "active") list = list.filter((s) => s.status === "Active");
    else if (activeFilter === "suspended") list = list.filter((s) => s.status === "Suspended");

    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      list = list.filter(
        (s) =>
          (s.name || "").toLowerCase().includes(normalizedQuery) ||
          (s.usn || "").toLowerCase().includes(normalizedQuery) ||
          (s.libraryId || "").toLowerCase().includes(normalizedQuery)
      );
    }

    return [...list].sort((a, b) => {
      const cmp = (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase());
      return sortDirection === "desc" ? -cmp : cmp;
    });
  }, [students, activeFilter, query, sortDirection]);

  const toggleSort = () => setSortDirection((d) => (d === "asc" ? "desc" : "asc"));

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.getParent("RootDrawer")?.openDrawer()}>
          <Ionicons name="menu" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Student Registry</Text>
        <View style={styles.rightIcons}>
          <TouchableOpacity style={{ marginRight: 12 }}>
            <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Image source={{ uri: "https://i.pravatar.cc/100?img=12" }} style={styles.avatar} />
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.placeholder} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, USN, or Library ID..."
            placeholderTextColor={colors.placeholder}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Visible A-Z / Z-A toggle: one tap flips the sort and the icon,
            no hidden menu required. */}
        <TouchableOpacity style={styles.sortBtn} onPress={toggleSort} activeOpacity={0.7}>
          <Ionicons
            name={sortDirection === "asc" ? "arrow-down" : "arrow-up"}
            size={16}
            color={colors.primary}
          />
          <Text style={styles.sortBtnText}>{sortDirection === "asc" ? "A-Z" : "Z-A"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chipsRow}>
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <TouchableOpacity
              key={filter.key}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {filter.label} ({filter.count.toLocaleString()})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadStudents}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={visibleStudents}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
          }
          renderItem={({ item }) => (
            <StudentCard
              student={item}
              onPress={() => navigation.navigate("StudentDetail", { studentId: item.id, student: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="people-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>
                {query ? "No students match your search." : "No students found."}
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AddStudent")}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  title: { flex: 1, fontSize: 18, fontWeight: "700", color: colors.textPrimary, marginLeft: 14 },
  rightIcons: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  searchRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 14 },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.sidebarBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: colors.textPrimary },
  sortBtn: {
    marginLeft: 10,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  sortBtnText: { fontSize: 12, fontWeight: "700", color: colors.primary, marginLeft: 5 },
  chipsRow: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 14 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.sidebarBg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: "600", color: colors.textSecondary },
  chipTextActive: { color: "#fff" },
  list: { paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  errorText: { color: colors.danger, marginTop: 8, textAlign: "center" },
  retryBtn: { marginTop: 12, paddingHorizontal: 20, paddingVertical: 9, borderRadius: 8, backgroundColor: colors.primary },
  retryText: { color: "#FFFFFF", fontWeight: "600" },
  emptyText: { color: colors.textSecondary, marginTop: 10, textAlign: "center" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
