import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { statusStyles, colors } from "../theme/colors";

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || {
    color: colors.textSecondary,
    bg: colors.inactiveBg,
  };

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.color }]} numberOfLines={1}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
  },
});
