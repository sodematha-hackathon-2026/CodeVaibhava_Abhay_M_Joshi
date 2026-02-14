import React from "react";
import { Modal, View, Text, ScrollView, Pressable, Platform, StatusBar as RNStatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { THEME } from "../theme/Theme";

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
      <View style={{ flex: 1, backgroundColor: THEME.colors.background }}>
        <StatusBar style="dark" />
        
        <View style={{ 
          paddingTop: Platform.OS === 'ios' ? insets.top : RNStatusBar.currentHeight || 0,
          backgroundColor: THEME.colors.surface
        }}>
          <View style={{ 
            padding: 16, 
            backgroundColor: THEME.colors.surface, 
            borderBottomWidth: 1, 
            borderColor: THEME.colors.border.light,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: "900",
              color: THEME.colors.text.primary
            }}>
              {title}
            </Text>
            <Pressable onPress={onClose}>
              <Text style={{ 
                fontSize: 28, 
                fontWeight: "300", 
                color: THEME.colors.text.primary 
              }}>
                ×
              </Text>
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ 
          padding: 16,
          paddingBottom: Math.max(insets.bottom, 16) + 20
        }}>
          <View style={{ 
            backgroundColor: THEME.colors.surface, 
            borderRadius: THEME.borderRadius.lg, 
            padding: 14, 
            borderWidth: 1, 
            borderColor: THEME.colors.border.light,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}>
            <Text style={{ 
              lineHeight: 20,
              color: THEME.colors.text.primary
            }}>
              {body}
            </Text>
          </View>

          <Pressable
            onPress={onClose}
            style={{ 
              marginTop: 16, 
              backgroundColor: THEME.colors.primary, 
              paddingVertical: 12, 
              borderRadius: THEME.borderRadius.md, 
              alignItems: "center",
              shadowColor: THEME.colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{ 
              color: "white", 
              fontWeight: "900",
              fontSize: 16
            }}>
              Close
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}