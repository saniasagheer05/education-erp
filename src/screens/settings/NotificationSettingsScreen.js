import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { colors } from "../../theme/colors";
import { registerForPushNotifications } from "../../utils/pushNotifications";
import * as Device from "expo-device";

export default function NotificationSettingsScreen() {
  const [status, setStatus] = useState(null);
  const handleEnable = async () => {
    setStatus("checking");
    if (!Device.isDevice) { setStatus("unavailable"); return; }
    const token = await registerForPushNotifications();
    setStatus(token ? "enabled" : "unavailable");
  };
  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <Header title="Notification Preferences" showSearch={false} />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.card}>
          <View style={s.iconWrap}><Ionicons name="notifications-outline" size={22} color={colors.primary} /></View>
          <Text style={s.title}>Push Notifications</Text>
          <Text style={s.desc}>Get notified on this device when a new announcement is posted for students.</Text>
          <TouchableOpacity style={s.enableBtn} onPress={handleEnable} disabled={status === "checking"}>
            {status === "checking" ? <ActivityIndicator color="#fff" /> : <Text style={s.enableBtnText}>Enable on This Device</Text>}
          </TouchableOpacity>
          {status === "enabled" && (
            <View style={s.resultRow}><Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={[s.resultText, { color: colors.success }]}>Push notifications are enabled.</Text></View>
          )}
          {status === "unavailable" && (
            <View style={s.resultRow}><Ionicons name="information-circle" size={16} color={colors.textSecondary} />
              <Text style={s.resultText}>Not available here - this needs a physical device with a built app (not Expo Go or an emulator), and permission granted when asked.</Text></View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 20, alignItems: "center" },
  iconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  title: { fontSize: 15, fontWeight: "700", color: colors.textPrimary },
  desc: { fontSize: 13, color: colors.textSecondary, textAlign: "center", marginTop: 6, marginBottom: 18, lineHeight: 18 },
  enableBtn: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24, alignSelf: "stretch", alignItems: "center" },
  enableBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  resultRow: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  resultText: { fontSize: 12, color: colors.textSecondary, marginLeft: 8, flex: 1, lineHeight: 17 },
});
