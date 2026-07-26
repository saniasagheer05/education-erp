import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme/colors";
import { mockStudents } from "../data/mockStudents";
import StudentCard from "../components/StudentCard";

const FILTERS = [
  { key: "all", label: "All Students", count: 2450 },
  { key: "active", label: "Active", count: 2410 },
  { key: "suspended", label: "Suspended", count: 15 },
];

export default function StudentRegistryScreen() {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredStudents =
    activeFilter === "active"
      ? mockStudents.filter((s) => s.status === "Active")
      : activeFilter === "suspended"
      ? mockStudents.filter((s) => s.status === "Suspended")
      : mockStudents;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => navigation.getParent("RootDrawer")?.openDrawer()}
        >
          <Ionicons name="menu" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Student Registry</Text>
        <View style={styles.rightIcons}>
          <TouchableOpacity style={{ marginRight: 12 }}>
            <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=12" }}
            style={styles.avatar}
          />
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.placeholder} />
          <Text style={styles.searchPlaceholder}>Search by name, USN, or ID...</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={18} color={colors.primary} />
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

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.libraryId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <StudentCard
            student={item}
            onPress={() => navigation.navigate("StudentDetail", { student: item })}
          />
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddStudent")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginLeft: 14,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
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
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.placeholder,
  },
  filterBtn: {
    marginLeft: 10,
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  chipsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.sidebarBg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: "#fff",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
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
