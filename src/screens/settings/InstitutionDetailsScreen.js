import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { colors } from "../../theme/colors";

// Static institutional information (like an "About" page) - this is app
// content, not analytics/student data, so it is fine as fixed text rather
// than something fetched from an API.
const DETAILS = [
  { label: "Institution", value: "Sri Venkateshwara College of Engineering", icon: "school-outline" },
  { label: "Portal", value: "SVCE ERP - Academic Management System", icon: "apps-outline" },
  { label: "Department Office", value: "Office of the Registrar", icon: "business-outline" },
  { label: "Support Email", value: "erp-support@svce.edu.in", icon: "mail-outline" },
];

export default function InstitutionDetailsScreen() {
  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <Header title="Institution Details" showSearch={false} />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.card}>
          {DETAILS.map((row, i) => (
            <View key={row.label} style={[s.row, i !== DETAILS.length - 1 && s.rowBorder]}>
              <Ionicons name={row.icon} size={18} color={colors.textSecondary} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={s.rowLabel}>{row.label}</Text>
                <Text style={s.rowValue}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  rowLabel: { fontSize: 11, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 0.4 },
  rowValue: { fontSize: 14, color: colors.textPrimary, marginTop: 2, fontWeight: "600" },
});
