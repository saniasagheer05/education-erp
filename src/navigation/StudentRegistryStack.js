import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StudentRegistryScreen from "../screens/StudentRegistryScreen";
import AddStudentScreen from "../screens/AddStudentScreen";
import StudentDetailScreen from "../screens/StudentDetailScreen";

const Stack = createNativeStackNavigator();

export default function StudentRegistryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentRegistryList" component={StudentRegistryScreen} />
      <Stack.Screen name="AddStudent" component={AddStudentScreen} />
      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
    </Stack.Navigator>
  );
}
