import React from "react";
import { Modal, View, Text, ScrollView, Pressable, Platform, StatusBar as RNStatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function LegalModal({
  visible,
  title,
  body,
  onClose,
}: {
  visible: boolean;
  title: string;
  body: string;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
        <StatusBar style="dark" />
        
        <View style={{ 
          paddingTop: Platform.OS === 'ios' ? insets.top : RNStatusBar.currentHeight || 0,
          backgroundColor: "white"
        }}>
          <View style={{ 
            padding: 16, 
            backgroundColor: "white", 
            borderBottomWidth: 1, 
            borderColor: "#E5E7EB",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <Text style={{ fontSize: 18, fontWeight: "900" }}>{title}</Text>
            <Pressable onPress={onClose}>
              <Text style={{ fontSize: 28, fontWeight: "300", color: "#111827" }}>×</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ 
          padding: 16,
          paddingBottom: Math.max(insets.bottom, 16) + 20
        }}>
          <View style={{ 
            backgroundColor: "white", 
            borderRadius: 16, 
            padding: 14, 
            borderWidth: 1, 
            borderColor: "#E5E7EB" 
          }}>
            <Text style={{ lineHeight: 20 }}>{body}</Text>
          </View>

          <Pressable
            onPress={onClose}
            style={{ 
              marginTop: 16, 
              backgroundColor: "#111827", 
              paddingVertical: 12, 
              borderRadius: 12, 
              alignItems: "center" 
            }}
          >
            <Text style={{ color: "white", fontWeight: "900" }}>Close</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}