import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import { colors } from "../theme/colors";
import { mockStudents } from "../data/mockStudents";
import StudentCard from "../components/StudentCard";

export default function SearchStudentScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");

  const results = query
    ? mockStudents.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.usn.toLowerCase().includes(query.toLowerCase()) ||
          s.libraryId.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header
        title="Search Student"
        searchPlaceholder="Search by name, USN, or Library ID..."
      />
      <View style={styles.body}>
        {query === "" ? (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              Start typing a name, USN, or Library ID to find a student.
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.libraryId}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <StudentCard
                student={item}
                onPress={() => navigation.navigate("StudentDetail", { student: item })}
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
