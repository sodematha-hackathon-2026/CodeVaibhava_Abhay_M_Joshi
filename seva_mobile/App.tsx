import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";
import { ConfigProvider } from "./src/context/ConfigContext";
import "./src/i18n/index";
import { LegalProvider } from "./src/context/LegalContext";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/store/store";

export default function App() {
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
