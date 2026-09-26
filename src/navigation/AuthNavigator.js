import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminLoginScreen from "../screens/AdminLoginScreen";
import StudentLoginScreen from "../screens/StudentLoginScreen";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  // Land on whichever portal (admin/student) was last used, so logging
  // out returns you to the same login screen you came from instead of
  // always defaulting to Student Login. Both screens still cross-link to
  // each other, so switching accounts/portals is always one tap away.
  const { lastPortal } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={lastPortal === "admin" ? "AdminLogin" : "StudentLogin"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
    </Stack.Navigator>
  );
}
