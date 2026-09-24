import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminLoginScreen from "../screens/AdminLoginScreen";
import StudentLoginScreen from "../screens/StudentLoginScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="StudentLogin"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
    </Stack.Navigator>
  );
}
