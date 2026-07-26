import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { colors } from "../theme/colors";

const SETTINGS_ITEMS = [
  { icon: "person-outline", label: "Account Settings" },
  { icon: "notifications-outline", label: "Notification Preferences" },
  { icon: "lock-closed-outline", label: "Privacy & Security" },
  { icon: "school-outline", label: "Institution Details" },
  { icon: "help-circle-outline", label: "Help & Support" },
  { icon: "log-out-outline", label: "Log Out" },
];

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Settings" showSearch={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=12" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.profileName}>Admin User</Text>
            <Text style={styles.profileRole}>Office of Registrar</Text>
          </View>
        </View>

        <View style={styles.card}>
          {SETTINGS_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.row,
                index !== SETTINGS_ITEMS.length - 1 && styles.rowBorder,
              ]}
            >
              <Ionicons name={item.icon} size={19} color={colors.textSecondary} />
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 14 },
  profileName: { fontSize: 15, fontWeight: "700", color: colors.textPrimary },
  profileRole: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowLabel: { flex: 1, fontSize: 14, color: colors.textPrimary, marginLeft: 12 },
});
