import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import StudentHomeScreen from "../screens/student/StudentHomeScreen";
import StudentAttendanceScreen from "../screens/student/StudentAttendanceScreen";
import StudentFeesScreen from "../screens/student/StudentFeesScreen";
import StudentTimetableScreen from "../screens/student/StudentTimetableScreen";
import StudentAnnouncementsScreen from "../screens/student/StudentAnnouncementsScreen";
import StudentProfileScreen from "../screens/student/StudentProfileScreen";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: "home",
  Attendance: "calendar",
  Fees: "card",
  Timetable: "time",
  Notices: "megaphone",
  Profile: "person",
};

export default function StudentNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: colors.surface,
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
      <Tab.Screen name="Home" component={StudentHomeScreen} />
      <Tab.Screen name="Attendance" component={StudentAttendanceScreen} />
      <Tab.Screen name="Fees" component={StudentFeesScreen} />
      <Tab.Screen name="Timetable" component={StudentTimetableScreen} />
      <Tab.Screen name="Notices" component={StudentAnnouncementsScreen} />
      <Tab.Screen name="Profile" component={StudentProfileScreen} />
    </Tab.Navigator>
  );
}
