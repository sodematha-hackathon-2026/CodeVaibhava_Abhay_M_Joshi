import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Alert,
  Animated,
} from "react-native";
import Voice from "@react-native-voice/voice";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { setLastSectionQuery } from "../store/slices/appSlice";
import { useNavigation } from "@react-navigation/native";
import { THEME } from "../theme/Theme";
import { Card } from "../components/Card";

type SectionItem = {
  key: string;
  title: string;
  subtitle?: string;
  route: string;
  icon: string;
};

const SECTIONS: SectionItem[] = [
  { key: "home", title: "Home", route: "Home", icon: "🏛️" },
  { key: "events", title: "Event Calendar", route: "Events", icon: "📅" },
  { key: "sevas", title: "Sevas", route: "Sevas", icon: "🙏" },
  { key: "booking", title: "Room Booking", route: "Booking", icon: "🏨" },
  { key: "gallery", title: "Gallery", route: "Gallery", icon: "📸" },
  { key: "artefacts", title: "Artefacts", route: "Artefacts", icon: "📚" },
  { key: "history", title: "History & Parampara", route: "History", icon: "📜" },
  { key: "quiz", title: "Youth Quiz", route: "Quiz", icon: "❓" },
  { key: "news", title: "Top News", route: "Home", icon: "📰" },
  { key: "flash", title: "Flash Updates", route: "Home", icon: "⚡" },
  { key: "timings", title: "Darshan & Prasada Timings", route: "Home", icon: "🕉️" },
];

export default function SectionsSearchScreen() {
  const navigation: any = useNavigation();
  const dispatch = useAppDispatch();
  const last = useAppSelector((s) => s.app.lastSectionQuery);

  const [q, setQ] = useState(last);
  const [listening, setListening] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const filtered = useMemo(() => {
    const x = q.trim().toLowerCase();
    if (!x) return SECTIONS;
    return SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(x) ||
        (s.subtitle || "").toLowerCase().includes(x)
    );
  }, [q]);

  const startVoice = async () => {
    try {
      setListening(true);
      Voice.removeAllListeners();

      Voice.onSpeechResults = (e: any) => {
        const text = e.value?.[0] || "";
        setQ(text);
        dispatch(setLastSectionQuery(text));
      };

      Voice.onSpeechError = () => {
        setListening(false);
        Alert.alert("Voice", "Could not recognize. Try again.");
      };

      await Voice.start("en-IN");
    } catch (e) {
      setListening(false);
      Alert.alert("Voice", "Mic failed. Ensure permission.");
    }
  };

  const stopVoice = async () => {
    try {
      await Voice.stop();
    } finally {
      setListening(false);
    }
  };

  const open = (item: SectionItem) => {
    dispatch(setLastSectionQuery(q));
    navigation.navigate(item.route as never);
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: THEME.colors.background,
      padding: 16,
      paddingBottom: 100,
    }}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Header */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 24,
            fontWeight: '800',
            color: THEME.colors.text.primary,
          }}>
            Search Sections
          </Text>
          <View style={{
            width: 60,
            height: 3,
            backgroundColor: THEME.colors.sacred.saffron,
            marginTop: 4,
            borderRadius: 2,
          }} />
        </View>

        {/* Search Bar */}
        <Card style={{
          padding: 0,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          marginBottom: 16,
        }}>
          <TextInput
            value={q}
            onChangeText={(v) => {
              setQ(v);
              dispatch(setLastSectionQuery(v));
            }}
            placeholder="Search…"
            placeholderTextColor={THEME.colors.text.tertiary}
            style={{
              flex: 1,
              paddingVertical: 6,
              fontSize: 16,
              color: THEME.colors.text.primary,
            }}
          />

          <Pressable
            onPress={listening ? stopVoice : startVoice}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: THEME.borderRadius.md,
              backgroundColor: listening 
                ? THEME.colors.error 
                : THEME.colors.primary,
            }}
          >
            <Text style={{
              color: THEME.colors.text.inverse,
              fontWeight: '800',
            }}>
              {listening ? "🛑 Stop" : "🎤 Mic"}
            </Text>
          </Pressable>
        </Card>

        {/* Results */}
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.key}
          renderItem={({ item, index }) => (
            <SectionCard item={item} index={index} onPress={() => open(item)} />
          )}
          ListEmptyComponent={
            <Card>
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Text style={{ fontSize: 48, marginBottom: 8 }}>🔍</Text>
                <Text style={{
                  color: THEME.colors.text.secondary,
                  fontWeight: '600',
                }}>
                  No matching sections.
                </Text>
              </View>
            </Card>
          }
        />
      </Animated.View>
    </View>
  );
}

const SectionCard = ({
  item,
  index,
  onPress,
}: {
  item: SectionItem;
  index: number;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 60,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{
      transform: [{ scale: scaleAnim }],
      marginBottom: 10,
    }}>
      <Card onPress={onPress}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: THEME.colors.overlay,
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Text style={{ fontSize: 24 }}>{item.icon}</Text>
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{
              fontWeight: '800',
              fontSize: 16,
              color: THEME.colors.text.primary,
            }}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={{
                marginTop: 2,
                color: THEME.colors.text.secondary,
                fontSize: 13,
              }}>
                {item.subtitle}
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
};