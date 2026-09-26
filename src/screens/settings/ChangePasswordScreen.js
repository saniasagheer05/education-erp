import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import { colors } from "../../theme/colors";
import { authorizedFetch } from "../../api/apiClient";

// Wired to a real backend endpoint (PUT /api/admin/me/password) which
// verifies the current password with bcrypt before updating it - this is
// a real account action, not a placeholder form.
export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing details", "Please fill in all three fields.");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Password too short", "New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords don't match", "New password and confirmation must match.");
      return;
    }
    try {
      setIsSaving(true);
      await authorizedFetch("/admin/me/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      Alert.alert("Password updated", "Your password has been changed successfully.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert("Could not update password", err.message || "Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <Header title="Privacy & Security" showSearch={false} />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.sectionTitle}>Change Password</Text>
        <View style={s.card}>
          <Text style={s.label}>Current Password</Text>
          <TextInput style={s.input} value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry placeholder="Enter current password" placeholderTextColor={colors.placeholder} />
          <Text style={s.label}>New Password</Text>
          <TextInput style={s.input} value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="At least 8 characters" placeholderTextColor={colors.placeholder} />
          <Text style={s.label}>Confirm New Password</Text>
          <TextInput style={s.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Re-enter new password" placeholderTextColor={colors.placeholder} />
          <TouchableOpacity style={[s.saveBtn, isSaving && s.saveBtnDisabled]} onPress={handleSave} disabled={isSaving}>
            {isSaving ? <ActivityIndicator color="#fff" /> : <><Ionicons name="lock-closed-outline" size={16} color="#fff" /><Text style={s.saveBtnText}>Update Password</Text></>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: colors.textPrimary, marginBottom: 10 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16 },
  label: { fontSize: 12, fontWeight: "600", color: colors.labelBlue, marginBottom: 6, marginTop: 8 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.textPrimary, backgroundColor: colors.background },
  saveBtn: { marginTop: 18, height: 46, borderRadius: 10, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "700", marginLeft: 8 },
});
