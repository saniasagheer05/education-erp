import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabs from "./BottomTabs";
import ImportStudentsScreen from "../screens/ImportStudentsScreen";
import TransferStudentScreen from "../screens/TransferStudentScreen";
import ExportStudentDataScreen from "../screens/ExportStudentDataScreen";
import SidebarDrawerContent from "../components/SidebarDrawerContent";
import { colors } from "../theme/colors";

const Drawer = createDrawerNavigator();

export default function RootNavigator() {
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
