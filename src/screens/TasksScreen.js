import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { colors } from "../theme/colors";

export default function TasksScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Tasks" showSearch={false} />
      <View style={styles.empty}>
        <Ionicons name="checkbox-outline" size={40} color={colors.textMuted} />
        <Text style={styles.emptyText}>No pending tasks right now.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 13, color: colors.textSecondary, marginTop: 12 },
});
