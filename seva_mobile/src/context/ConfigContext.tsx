import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View, Text, Alert } from "react-native";
import { AppConfig, fetchConfig } from "../services/configApi";

type Ctx = {
  config: AppConfig | null;
  refresh: () => Promise<void>;
};

const ConfigContext = createContext<Ctx | null>(null);

export function useAppConfig() {
  const v = useContext(ConfigContext);
  if (!v) throw new Error("ConfigContext missing");
  return v;
}

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const c = await fetchConfig();
      setConfig(c);
    } catch (e: any) {
      console.log("Config load error:", e?.message || e);
      Alert.alert("Error", "Failed to load app configuration");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
  }, []);

  if (loading && !config) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Loading app…</Text>
      </View>
    );
  }

  return (
    <ConfigContext.Provider value={{ config, refresh }}>
      {children}
    </ConfigContext.Provider>
  );
}
