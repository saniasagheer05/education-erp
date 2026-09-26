import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { colors } from "../../theme/colors";

const FAQS = [
  { q: "I can't find a student", a: "Use Student Registry's search bar (name, USN, or Library ID) or the Search tab." },
  { q: "A lookup says \"Not Found\"", a: "Double-check the Library ID or USN matches exactly what's on the student's registry record." },
  { q: "How do I reset my password?", a: "Go to Settings > Privacy & Security > Change Password." },
];

export default function HelpSupportScreen() {
  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <Header title="Help & Support" showSearch={false} />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.card}>
          <Text style={s.sectionTitle}>Frequently Asked</Text>
          {FAQS.map((item, i) => (
            <View key={item.q} style={[s.faqRow, i !== FAQS.length - 1 && s.rowBorder]}>
              <Text style={s.q}>{item.q}</Text>
              <Text style={s.a}>{item.a}</Text>
            </View>
          ))}
        </View>
        <View style={s.card}>
          <Text style={s.sectionTitle}>Contact Support</Text>
          <TouchableOpacity style={s.contactRow} onPress={() => Linking.openURL("mailto:erp-support@svce.edu.in")}>
            <Ionicons name="mail-outline" size={18} color={colors.primary} />
            <Text style={s.contactText}>erp-support@svce.edu.in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.textPrimary, marginBottom: 12 },
  faqRow: { paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  q: { fontSize: 13, fontWeight: "700", color: colors.textPrimary },
  a: { fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 17 },
  contactRow: { flexDirection: "row", alignItems: "center" },
  contactText: { fontSize: 14, color: colors.primary, fontWeight: "600", marginLeft: 10 },
});
