import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

export default function DisabledModule({ name }: { name: string }) {
  const { t } = useTranslation();
  
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "900" }}>{name} {t('disabled.disabled')}</Text>
      <Text style={{ marginTop: 8, color: "#6B7280", textAlign: "center" }}>
        {t('disabled.message')}
      </Text>
    </View>
  );
}