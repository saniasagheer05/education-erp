import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";

const SETTINGS_ITEMS = [
  { key: "account", icon: "person-outline", label: "Account Settings" },
  { key: "notifications", icon: "notifications-outline", label: "Notification Preferences" },
  { key: "privacy", icon: "lock-closed-outline", label: "Privacy & Security" },
  { key: "institution", icon: "school-outline", label: "Institution Details" },
  { key: "help", icon: "help-circle-outline", label: "Help & Support" },
  { key: "logout", icon: "log-out-outline", label: "Log Out" },
];

export default function SettingsScreen() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clears the JWT from AsyncStorage and flips isAuthenticated to
      // false in AuthContext, which makes RootNavigator switch back to
      // AuthNavigator (AdminLoginScreen) automatically.
      await logout();
    } catch (error) {
      Alert.alert("Error", "Could not log out cleanly. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: handleLogout,
      },
    ]);
  };

  const handleItemPress = (key) => {
    if (key === "logout") {
      confirmLogout();
    }
    // Other settings rows (account, notifications, privacy, institution,
    // help) are placeholders for now — no screens exist for them yet.
  };

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
              key={item.key}
              style={[
                styles.row,
                index !== SETTINGS_ITEMS.length - 1 && styles.rowBorder,
              ]}
              onPress={() => handleItemPress(item.key)}
              disabled={item.key === "logout" && isLoggingOut}
            >
              <Ionicons
                name={item.icon}
                size={19}
                color={item.key === "logout" ? colors.danger : colors.textSecondary}
              />
              <Text
                style={[
                  styles.rowLabel,
                  item.key === "logout" && { color: colors.danger },
                ]}
              >
                {item.label}
              </Text>
              {item.key === "logout" && isLoggingOut ? (
                <ActivityIndicator size="small" color={colors.danger} />
              ) : (
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              )}
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
