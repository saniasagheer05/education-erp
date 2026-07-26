import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

// Items that live inside the bottom tab navigator ("MainTabs")
const TAB_MENU_ITEMS = [
  { tabName: "Home", label: "Dashboard", icon: "grid-outline" },
  { tabName: "Students", label: "Student Registry", icon: "people-outline" },
  { tabName: "Search", label: "Search Student", icon: "search-outline" },
];

// Items that are standalone drawer screens
const STANDALONE_MENU_ITEMS = [
  { key: "ImportStudents", label: "Import Students", icon: "person-add-outline" },
  { key: "TransferStudent", label: "Transfer Student", icon: "swap-horizontal-outline" },
  { key: "ExportStudentData", label: "Export Student Data", icon: "download-outline" },
];

export default function SidebarDrawerContent(props) {
  const { navigation, state } = props;
  const activeRouteName = state.routes[state.index]?.name;

  // Determine which tab is active when we're on the MainTabs route
  const mainTabsRoute = state.routes.find((r) => r.name === "MainTabs");
  const activeTabName =
    activeRouteName === "MainTabs" && mainTabsRoute?.state
      ? mainTabsRoute.state.routes[mainTabsRoute.state.index]?.name
      : null;

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <Text style={styles.brandTitle}>SVCE ERP</Text>
        <Text style={styles.brandSubtitle}>Academic Management</Text>
      </View>

      <ScrollView contentContainerStyle={styles.menuList}>
        {TAB_MENU_ITEMS.map((item) => {
          const isActive = activeTabName === item.tabName;
          return (
            <TouchableOpacity
              key={item.tabName}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() =>
                navigation.navigate("MainTabs", { screen: item.tabName })
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={19}
                color={isActive ? colors.primary : colors.textSecondary}
                style={styles.menuIcon}
              />
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {STANDALONE_MENU_ITEMS.map((item) => {
          const isActive = activeRouteName === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => navigation.navigate(item.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={19}
                color={isActive ? colors.primary : colors.textSecondary}
                style={styles.menuIcon}
              />
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.divider} />

        <TouchableOpacity
          style={[styles.menuItem, activeTabName === "Settings" && styles.menuItemActive]}
          onPress={() => navigation.navigate("MainTabs", { screen: "Settings" })}
        >
          <Ionicons
            name="settings-outline"
            size={19}
            color={activeTabName === "Settings" ? colors.primary : colors.textSecondary}
            style={styles.menuIcon}
          />
          <Text
            style={[
              styles.menuLabel,
              activeTabName === "Settings" && styles.menuLabelActive,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.profile}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100?img=12" }}
          style={styles.profileAvatar}
        />
        <View>
          <Text style={styles.profileName}>Admin User</Text>
          <Text style={styles.profileRole}>Office of Registrar</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sidebarBg,
  },
  brand: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  brandSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuList: {
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 2,
  },
  menuItemActive: {
    backgroundColor: colors.primaryLight,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  menuLabelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  profileName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  profileRole: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
