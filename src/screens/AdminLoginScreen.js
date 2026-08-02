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
import { colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";
import { adminLogin } from "../api/authApi";

export default function AdminLoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const { response, result } = await adminLogin(email.trim(), password.trim());

      if (!response.ok || !result.success) {
        Alert.alert("Login Failed", result.message || "Invalid email or password.");
        return;
      }

      try {
        await login(result.data.token);
      } catch (storageError) {
        console.error("Failed to persist auth token:", storageError);
        Alert.alert(
          "Login Failed",
          "Logged in, but could not save your session. Please try again."
        );
      }
    } catch (error) {
      console.error("Admin login network error:", error);
      Alert.alert(
        "Login Failed",
        "Could not connect to the server after several attempts. Make sure the backend is running and 'adb reverse tcp:5000 tcp:5000' is active, then try again."
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
        <Text style={styles.brand}>SVCE ERP</Text>
        <Text style={styles.subBrand}>Admin Login</Text>

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="admin@svce.edu.in"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.placeholder}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textContentType="password"
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Log In</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  brand: { fontSize: 24, fontWeight: "700", color: colors.primary, textAlign: "center" },
  subBrand: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 32,
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
  loginBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  loginText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
