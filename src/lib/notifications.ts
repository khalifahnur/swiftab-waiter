import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { registerPushToken, removePushToken } from "@/api/api";

/**
 * Push notifications for the floor: a new order at a table, a guest asking
 * for the bill. The API sends them to every waiter of the restaurant.
 */

const native = Platform.OS !== "web";

// Show them while the app is open too: a waiter may be on another screen.
if (native) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

let channelsReady: Promise<void> | null = null;

/** Android needs channels before anything can be shown or a token issued. */
function ensureChannels(): Promise<void> {
  if (Platform.OS !== "android") return Promise.resolve();
  if (!channelsReady) {
    const make = (id: string, name: string, description: string) =>
      Notifications.setNotificationChannelAsync(id, {
        name,
        description,
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 300, 200, 300],
        lightColor: "#008080",
        sound: "default",
      });
    channelsReady = Promise.all([
      make("default", "General", "Messages from Swiftab"),
      make("orders", "Orders", "New orders and bill requests at your tables"),
    ]).then(() => undefined);
  }
  return channelsReady;
}

export async function ensurePermission(ask = true): Promise<boolean> {
  if (!native) return false;
  await ensureChannels();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!ask || !current.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

const projectId = () => Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

let registeredToken: string | null = null;

/** Gives this device's Expo push token to the API. Null on simulators, web, or when refused. */
export async function registerForPush(waiterId: string): Promise<string | null> {
  if (!native || !Device.isDevice) return null;
  try {
    if (!(await ensurePermission(true))) return null;
    const id = projectId();
    if (!id) return null;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId: id })).data;
    if (token && token !== registeredToken) {
      await registerPushToken(waiterId, token);
      registeredToken = token;
    }
    return token;
  } catch {
    // Push is optional: the queues still refresh on their own.
    return null;
  }
}

/** Stops notifications to this device, for sign-out or when they are switched off. */
export async function unregisterPush(waiterId: string): Promise<void> {
  if (!native || !Device.isDevice) return;
  try {
    const id = projectId();
    const token = registeredToken ?? (id ? (await Notifications.getExpoPushTokenAsync({ projectId: id })).data : null);
    if (token) await removePushToken(waiterId, token);
  } catch {
    // Nothing to undo if the token was never registered.
  } finally {
    registeredToken = null;
  }
}

/**
 * Listens for notifications. `onReceive` runs when one arrives while the app
 * is open; `onOpen` when the waiter taps one. Returns a cleanup function.
 */
export function listenForNotifications(handlers: { onReceive: () => void; onOpen: () => void }): () => void {
  if (!native) return () => undefined;
  const received = Notifications.addNotificationReceivedListener(() => handlers.onReceive());
  const opened = Notifications.addNotificationResponseReceivedListener(() => {
    handlers.onOpen();
    Notifications.clearLastNotificationResponse();
  });
  if (Notifications.getLastNotificationResponse()) {
    handlers.onOpen();
    Notifications.clearLastNotificationResponse();
  }
  return () => {
    received.remove();
    opened.remove();
  };
}
