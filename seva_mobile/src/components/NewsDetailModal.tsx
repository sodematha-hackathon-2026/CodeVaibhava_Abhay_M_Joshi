import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Modal,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";

interface NewsDetailModalProps {
  visible: boolean;
  news: {
    id: string;
    title: string;
    body: string;
    imageUrl: string;
  } | null;
  onClose: () => void;
}

export default function NewsDetailModal({
  visible,
  news,
  onClose,
}: NewsDetailModalProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  if (!news) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar style="dark" />

        {/* Header with Safe Area */}
        <View
          style={{
            paddingTop:
              Platform.OS === "ios"
                ? insets.top
                : RNStatusBar.currentHeight || 0,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 16,
              backgroundColor: "white",
              borderBottomWidth: 1,
              borderBottomColor: "#E5E7EB",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#111827" }}
            >
              {t("home.topNews")}
            </Text>
            <Pressable
              onPress={onClose}
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontSize: 32, fontWeight: "200", color: "#111827" }}
              >
                ×
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1, backgroundColor: "#F3F4F6" }}
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom, 16) + 20,
          }}
        >
          {news.imageUrl && (
            <Image
              source={{ uri: news.imageUrl }}
              style={{ width: "100%", height: 250, backgroundColor: "#E5E7EB" }}
              resizeMode="cover"
            />
          )}

          <View
            style={{
              backgroundColor: "white",
              margin: 16,
              padding: 20,
              borderRadius: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 12,
                color: "#111827",
                lineHeight: 32,
              }}
            >
              {news.title}
            </Text>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                color: "#374151",
              }}
            >
              {news.body}
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
