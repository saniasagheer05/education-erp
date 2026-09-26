import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { savePushToken } from "../api/announcementsApi";
let handlerConfigured = false;
function loadNotifications() { try { return require("expo-notifications"); } catch (err) { return null; } }
export async function registerForPushNotifications() {
  try {
    if (!Device.isDevice) return null;
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!projectId) return null;
    const Notifications = loadNotifications();
    if (!Notifications) return null;
    if (!handlerConfigured) { Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowAlert:true, shouldPlaySound:true, shouldSetBadge:false }) }); handlerConfigured = true; }
    if (Platform.OS === "android") await Notifications.setNotificationChannelAsync("default", { name:"default", importance: Notifications.AndroidImportance.MAX, vibrationPattern:[0,250,250,250] });
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== "granted") { const { status } = await Notifications.requestPermissionsAsync(); finalStatus = status; }
    if (finalStatus !== "granted") return null;
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    await savePushToken(token);
    return token;
  } catch (err) { return null; }
}
