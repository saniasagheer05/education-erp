import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme/colors";

export default function Header({
  title,
  showSearch = true,
  searchPlaceholder = "Search by name, USN, or ID...",
  searchValue,
  onSearchChange,
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => navigation.getParent("RootDrawer")?.openDrawer()}
          style={styles.iconBtn}
        >
          <Ionicons name="menu" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.bellWrap}>
            <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
            <View style={styles.dot} />
          </TouchableOpacity>
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=12" }}
            style={styles.avatar}
          />
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.placeholder} />
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.placeholder}
            value={searchValue}
            onChangeText={onSearchChange}
          />
          <Ionicons name="options-outline" size={18} color={colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellWrap: {
    marginRight: 12,
  },
  dot: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  searchBar: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.sidebarBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
