import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import { colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";

// Every row here now routes to a real screen (see SettingsStack.js) or, for
// Log Out, performs a real action. There are no dead/no-op rows left.
const SETTINGS_ITEMS = [
  { key: "account", icon: "person-outline", label: "Account Settings", route: "AccountSettings" },
  { key: "notifications", icon: "notifications-outline", label: "Notification Preferences", route: "NotificationSettings" },
  { key: "privacy", icon: "lock-closed-outline", label: "Privacy & Security", route: "ChangePassword" },
  { key: "institution", icon: "school-outline", label: "Institution Details", route: "InstitutionDetails" },
  { key: "help", icon: "help-circle-outline", label: "Help & Support", route: "HelpSupport" },
  { key: "logout", icon: "log-out-outline", label: "Log Out" },
];

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    // logout() flips auth state synchronously (see AuthContext.js), so this
    // screen unmounts immediately once called - no loading state to manage
    // or get stuck on.
    logout();
  };

  const confirmLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: handleLogout },
    ]);
  };

  const handleItemPress = (item) => {
    if (item.key === "logout") {
      confirmLogout();
      return;
    }
    navigation.navigate(item.route);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Settings" showSearch={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <Image source={{ uri: "https://i.pravatar.cc/100?img=12" }} style={styles.avatar} />
          <View>
            <Text style={styles.profileName}>{user?.name || "Admin User"}</Text>
            <Text style={styles.profileRole}>{user?.email || "Office of Registrar"}</Text>
          </View>
        </View>

        <View style={styles.card}>
          {SETTINGS_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.row, index !== SETTINGS_ITEMS.length - 1 && styles.rowBorder]}
              onPress={() => handleItemPress(item)}
            >
              <Ionicons
                name={item.icon}
                size={19}
                color={item.key === "logout" ? colors.danger : colors.textSecondary}
              />
              <Text style={[styles.rowLabel, item.key === "logout" && { color: colors.danger }]}>
                {item.label}
              </Text>
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
  profileCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, marginBottom: 16 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 14 },
  profileName: { fontSize: 15, fontWeight: "700", color: colors.textPrimary },
  profileRole: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  rowLabel: { flex: 1, fontSize: 14, color: colors.textPrimary, marginLeft: 12 },
});
