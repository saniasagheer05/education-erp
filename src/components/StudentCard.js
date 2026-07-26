import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import StatusBadge from "./StatusBadge";

export default function StudentCard({ student, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{student.initials}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {student.name}
          </Text>
        </View>
        <Text style={styles.usn}>USN: {student.usn}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="school-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.metaText}>{student.dept}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.metaText}>Sem {student.sem}</Text>
          </View>
        </View>
      </View>

      <StatusBadge status={student.status} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  usn: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});
