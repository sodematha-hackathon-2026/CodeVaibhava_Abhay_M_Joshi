import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";
import { ConfigProvider } from "./src/context/ConfigContext";
import "./src/i18n/index";
import { LegalProvider } from "./src/context/LegalContext";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/store/store";
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";


export default function App() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground notification received:", remoteMessage);

      if (remoteMessage.notification) {
        Alert.alert(
          remoteMessage.notification.title || "New Notification",
          remoteMessage.notification.body || "",
          [{ text: "OK" }],
        );
      }
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("Notification opened app from background:", remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification opened app from quit state:",
            remoteMessage,
          );
        }
      });

    return unsubscribe;
  }, []);
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator />
          </View>
        }
        persistor={persistor}
      >
        <LegalProvider>
          <ConfigProvider>
            <StatusBar backgroundColor="#3b1818" hidden={false} />
            <SafeAreaProvider>
              <RootNavigator />
            </SafeAreaProvider>
          </ConfigProvider>
        </LegalProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
