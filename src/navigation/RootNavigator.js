import React from "react";
import { View, ActivityIndicator } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabs from "./BottomTabs";
import ImportStudentsScreen from "../screens/ImportStudentsScreen";
import TransferStudentScreen from "../screens/TransferStudentScreen";
import ExportStudentDataScreen from "../screens/ExportStudentDataScreen";
import AuthNavigator from "./AuthNavigator";
import SidebarDrawerContent from "../components/SidebarDrawerContent";
import { colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";

const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator
      id="RootDrawer"
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 280 },
        overlayColor: "rgba(17, 24, 39, 0.4)",
      }}
      drawerContent={(props) => <SidebarDrawerContent {...props} />}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabs} />
      <Drawer.Screen name="ImportStudents" component={ImportStudentsScreen} />
      <Drawer.Screen name="TransferStudent" component={TransferStudentScreen} />
      <Drawer.Screen name="ExportStudentData" component={ExportStudentDataScreen} />
    </Drawer.Navigator>
  );
}

export default function RootNavigator() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return isAuthenticated ? <AppDrawer /> : <AuthNavigator />;
}