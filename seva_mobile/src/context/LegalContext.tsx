import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View, Text, Alert } from "react-native";
import { fetchLegal, LegalPayload } from "../services/legalApi";

type Ctx = {
  legal: LegalPayload | null;
  refresh: () => Promise<void>;
};

const LegalContext = createContext<Ctx | null>(null);

export function useLegal() {
  const v = useContext(LegalContext);
  if (!v) throw new Error("LegalContext missing");
  return v;
}

export function LegalProvider({ children }: { children: React.ReactNode }) {
  const [legal, setLegal] = useState<LegalPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await fetchLegal();
      setLegal(data);
    } catch (e: any) {
      console.log("Legal load error:", e?.message || e);
      Alert.alert("Error", "Failed to load legal documents");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
  }, []);

  if (loading && !legal) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Loading…</Text>
      </View>
    );
  }

  return <LegalContext.Provider value={{ legal, refresh }}>{children}</LegalContext.Provider>;
}
