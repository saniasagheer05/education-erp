import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";
import { studentLogin } from "../api/authApi";

export default function StudentLoginScreen({ navigation }) {
  const { login } = useAuth();
  const [libraryId, setLibraryId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!libraryId.trim() || !password) {
      Alert.alert("Missing details", "Please enter both Library ID and password.");
      return;
    }

    setIsLoading(true);
    try {
      const { response, result } = await studentLogin(
        libraryId.trim().toUpperCase(),
        password.trim()
      );

      if (!response.ok || !result.success) {
        Alert.alert(
          "Login Failed",
          result.message || "Invalid Library ID or password."
        );
        return;
      }

      try {
        await login(result.data.token, result.data.user);
      } catch (storageError) {
        console.error("Failed to persist auth token:", storageError);
        Alert.alert(
          "Login Failed",
          "Logged in, but could not save your session. Please try again."
        );
      }
    } catch (error) {
      console.error("Student login network error:", error);
      Alert.alert(
        "Login Failed",
        "Could not connect to the server. Make sure the backend is running and 'adb reverse tcp:5000 tcp:5000' is active."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Ionicons name="school-outline" size={32} color={colors.primary} />
          </View>
          <Text style={styles.brand}>SVCE ERP</Text>
          <Text style={styles.subBrand}>Student Portal Login</Text>
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Library ID</Text>
          <TextInput
            style={styles.input}
            value={libraryId}
            onChangeText={setLibraryId}
            placeholder="e.g. LIB-8821"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="characters"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.placeholder}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              textContentType="password"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.switchBtn}
          onPress={() => navigation.navigate("AdminLogin")}
        >
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
          <Text style={styles.switchText}>Admin / Staff Portal Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  header: { alignItems: "center", marginBottom: 28 },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  brand: { fontSize: 24, fontWeight: "700", color: colors.primary, textAlign: "center" },
  subBrand: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: "600", color: colors.labelBlue, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 14,
    color: colors.textPrimary,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  eyeBtn: {
    padding: 6,
  },
  loginBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  loginText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  switchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  switchText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
});
