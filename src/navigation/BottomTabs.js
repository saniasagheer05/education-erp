import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import DashboardScreen from "../screens/DashboardScreen";
import StudentRegistryStack from "./StudentRegistryStack";
import SearchStudentScreen from "../screens/SearchStudentScreen";
import TasksScreen from "../screens/TasksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: "home",
  Students: "people",
  Search: "search",
  Tasks: "clipboard",
  Settings: "settings",
};

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={`${ICONS[route.name]}${focused ? "" : "-outline"}`}
            size={20}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Students" component={StudentRegistryStack} />
      <Tab.Screen name="Search" component={SearchStudentScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
