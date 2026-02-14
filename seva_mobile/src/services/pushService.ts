import messaging from "@react-native-firebase/messaging";
import auth from "@react-native-firebase/auth";
import * as SecureStore from "expo-secure-store";
import { api } from "./backend";

const KEY = "push_enabled_v1";

export async function loadPushEnabled() {
  const v = await SecureStore.getItemAsync(KEY);
  return v === "true";
}

async function savePushEnabled(v: boolean) {
  await SecureStore.setItemAsync(KEY, v ? "true" : "false");
}

export async function enablePush() {
  const status = await messaging().requestPermission();
  const ok =
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL;

  if (!ok) throw new Error("Notification permission not granted");

  const fcmToken = await messaging().getToken();

    await api("/api/push/register", "POST", { token: fcmToken, enabled: true });

  await savePushEnabled(true);
  return true;
}

export async function disablePush() {
  const fcmToken = await messaging().getToken();

    await api("/api/push/register", "POST", { token: fcmToken, enabled: false });

  await savePushEnabled(false);
  return true;
}