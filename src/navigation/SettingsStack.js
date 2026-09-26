import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/SettingsScreen";
import AccountSettingsScreen from "../screens/settings/AccountSettingsScreen";
import NotificationSettingsScreen from "../screens/settings/NotificationSettingsScreen";
import ChangePasswordScreen from "../screens/settings/ChangePasswordScreen";
import InstitutionDetailsScreen from "../screens/settings/InstitutionDetailsScreen";
import HelpSupportScreen from "../screens/settings/HelpSupportScreen";

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="InstitutionDetails" component={InstitutionDetailsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Stack.Navigator>
  );
}
