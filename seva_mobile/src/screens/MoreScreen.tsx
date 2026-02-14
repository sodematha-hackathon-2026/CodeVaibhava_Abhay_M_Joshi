import React, { useRef, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Animated } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MoreStackParamList } from "../navigation/MoreStack";
import { useTranslation } from "react-i18next";
import { useAppConfig } from "../context/ConfigContext";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";

type Props = NativeStackScreenProps<MoreStackParamList, "MoreHome">;

const ICONS: Record<string, string> = {
  gallery: "📸",
  quiz: "❓",
  booking: "🏨",
  artefacts: "📚",
  history: "📜",
};

function MenuRow({
  title,
  subtitle,
  icon,
  onPress,
  index,
}: {
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
  index: number;
}) {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        delay: index * 100,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 100,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateX: slideAnim }],
    }}>
      <Card onPress={onPress} style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: THEME.colors.overlay,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14,
          }}>
            <Text style={{ fontSize: 24 }}>{icon}</Text>
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{
              fontWeight: '800',
              fontSize: 16,
              color: THEME.colors.text.primary,
            }}>
              {title}
            </Text>
            {subtitle && (
              <Text style={{
                marginTop: 4,
                color: THEME.colors.text.secondary,
                fontSize: 13,
              }}>
                {subtitle}
              </Text>
            )}
          </View>
          
          <Text style={{
            fontSize: 20,
            color: THEME.colors.primary,
          }}>
            →
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
}

export default function MoreScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { config } = useAppConfig();
  
  const menuItems = [
    config?.enableGallery && {
      key: 'gallery',
      title: t('more.gallery'),
      subtitle: t('more.gallerySubtitle'),
      icon: ICONS.gallery,
      onPress: () => navigation.navigate("GalleryAlbums"),
    },
    config?.enableQuiz && {
      key: 'quiz',
      title: t('more.quiz'),
      subtitle: t('more.quizSubtitle'),
      icon: ICONS.quiz,
      onPress: () => navigation.navigate("Quiz"),
    },
    config?.enableRoomBooking && {
      key: 'booking',
      title: t('more.booking'),
      subtitle: t('more.bookingSubtitle'),
      icon: ICONS.booking,
      onPress: () => navigation.navigate("Booking"),
    },
    config?.enableArtefacts && {
      key: 'artefacts',
      title: t('more.artefacts'),
      subtitle: t('more.artefactsSubtitle'),
      icon: ICONS.artefacts,
      onPress: () => navigation.navigate("Artefacts"),
    },
    config?.enableHistory && {
      key: 'history',
      title: t('more.history'),
      subtitle: t('more.historySubtitle'),
      icon: ICONS.history,
      onPress: () => navigation.navigate("History"),
    },
  ].filter(Boolean);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: THEME.colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
    >
      {/* Header */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{
          fontSize: 28,
          fontWeight: '800',
          color: THEME.colors.text.primary,
        }}>
          Explore More
        </Text>
        <View style={{
          width: 60,
          height: 3,
          backgroundColor: THEME.colors.sacred.saffron,
          marginTop: 6,
          borderRadius: 2,
        }} />
      </View>

      <TempleDivider ornamental />

      {menuItems.map((item: any, index) => (
        <MenuRow
          key={item.key}
          title={item.title}
          subtitle={item.subtitle}
          icon={item.icon}
          onPress={item.onPress}
          index={index}
        />
      ))}
    </ScrollView>
  );
}