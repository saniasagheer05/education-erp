import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import { colors } from "../theme/colors";
import { listStudents } from "../api/studentsApi";
import { mapApiStudentToCard } from "../utils/mapStudent";
import StudentCard from "../components/StudentCard";

export default function SearchStudentScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listStudents();
      setAllStudents(data.map(mapApiStudentToCard));
    } catch (err) {
      setError(err.message || "Could not load students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load once on mount...
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // ...and refresh every time this screen regains focus, so newly
  // added/edited/transferred students show up without a manual reload.
  useFocusEffect(
    useCallback(() => {
      loadStudents();
    }, [loadStudents])
  );

  const normalizedQuery = query.trim().toLowerCase();

  const results = normalizedQuery
    ? allStudents.filter(
        (s) =>
          (s.name || "").toLowerCase().includes(normalizedQuery) ||
          (s.usn || "").toLowerCase().includes(normalizedQuery) ||
          (s.libraryId || "").toLowerCase().includes(normalizedQuery)
      )
    : [];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header
        title="Search Student"
        searchPlaceholder="Search by name, USN, or Library ID..."
        searchValue={query}
        onSearchChange={setQuery}
      />
      <View style={styles.body}>
        {isLoading ? (
          <View style={styles.empty}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.empty}>
            <Ionicons name="alert-circle-outline" size={40} color={colors.danger} />
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        ) : normalizedQuery === "" ? (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              Start typing a name, USN, or Library ID to find a student.
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <StudentCard
                student={item}
                onPress={() =>
                  navigation.navigate("StudentDetail", { studentId: item.id, student: item })
                }
              />
            )}
            ListEmptyComponent={
              <Text style={styles.noResults}>No students match your search.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 12,
  },
  noResults: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: 40,
    fontSize: 13,
  },
});