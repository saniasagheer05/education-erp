import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";

export default function AccountSettingsScreen() {
  const { user } = useAuth();
  const rows = [
    { label: "Name", value: user?.name || "—", icon: "person-outline" },
    { label: "Email", value: user?.email || "—", icon: "mail-outline" },
    { label: "Role", value: user?.role === "admin" ? "Administrator" : (user?.role || "—"), icon: "shield-checkmark-outline" },
  ];
  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <Header title="Account Settings" showSearch={false} />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.profileCard}>
          <Image source={{ uri: "https://i.pravatar.cc/100?img=12" }} style={s.avatar} />
          <Text style={s.name}>{user?.name || "Admin"}</Text>
          <Text style={s.sub}>{user?.email || ""}</Text>
        </View>
        <View style={s.card}>
          {rows.map((row, i) => (
            <View key={row.label} style={[s.row, i !== rows.length - 1 && s.rowBorder]}>
              <Ionicons name={row.icon} size={18} color={colors.textSecondary} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={s.rowLabel}>{row.label}</Text>
                <Text style={s.rowValue}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={s.footnote}>To change your name or email, contact the college's IT administrator.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  profileCard: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 64, height: 64, borderRadius: 32, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: "700", color: colors.textPrimary },
  sub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  rowLabel: { fontSize: 11, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 0.4 },
  rowValue: { fontSize: 14, color: colors.textPrimary, marginTop: 2, fontWeight: "600" },
  footnote: { fontSize: 12, color: colors.textMuted, marginTop: 16, textAlign: "center" },
});
