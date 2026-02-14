import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Linking,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { useTranslation } from "react-i18next";
import { fetchHome, HomePayload } from "../services/homeApi";
import NewsDetailModal from "../components/NewsDetailModal";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const [data, setData] = useState<HomePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [newsIndex, setNewsIndex] = useState(0);
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);

  const news = data?.topNews ?? [];

    const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const newsSlideAnim = useRef(new Animated.Value(0)).current;
  const newsOpacityAnim = useRef(new Animated.Value(1)).current;

    const flashScrollRef = useRef<ScrollView>(null);
  const flashX = useRef(0);
  const flashContentW = useRef(0);
  const flashViewW = useRef(0);
  const flashDir = useRef<"right" | "left">("right");
  const flashUserActive = useRef(false);

  useEffect(() => {
        Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

        Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const fresh = await fetchHome();
        setData(fresh);
      } catch (e: any) {
        console.log("Home fetch error:", e?.message || e);
        Alert.alert(
          t("errors.error"),
          "Unable to load Home from server. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const flashesText = useMemo(
    () => (data?.flashUpdates ?? []).map((f) => f.text),
    [data],
  );

    useEffect(() => {
    if (!flashesText.length) return;

    const stepPx = 1;
    const tickMs = 20;
    const endPauseMs = 1800;
    let pausedUntil = 0;

    const id = setInterval(() => {
      if (flashUserActive.current) return;

      const now = Date.now();
      if (now < pausedUntil) return;

      const maxX = Math.max(0, flashContentW.current - flashViewW.current);
      if (maxX <= 0) return;

      let nextX =
        flashX.current + (flashDir.current === "right" ? stepPx : -stepPx);

      if (nextX >= maxX) {
        nextX = maxX;
        flashDir.current = "left";
        pausedUntil = Date.now() + endPauseMs;
      }

      if (nextX <= 0) {
        nextX = 0;
        flashDir.current = "right";
        pausedUntil = Date.now() + endPauseMs;
      }

      flashScrollRef.current?.scrollTo({ x: nextX, animated: false });
      flashX.current = nextX;
    }, tickMs);

    return () => clearInterval(id);
  }, [flashesText.length]);

  const goPrev = () => {
    if (newsIndex <= 0) return;
    animateNewsChange(-1, newsIndex - 1);
  };

  const goNext = () => {
    if (newsIndex >= news.length - 1) return;
    animateNewsChange(1, newsIndex + 1);
  };

  const animateNewsChange = (direction: -1 | 1, nextIndex: number) => {
    newsSlideAnim.setValue(20 * direction);
    newsOpacityAnim.setValue(0);
    setNewsIndex(nextIndex);

    Animated.parallel([
      Animated.timing(newsSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(newsOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const openNews = (newsItem: any) => {
    setSelectedNews(newsItem);
    setNewsModalOpen(true);
  };

  const openLink = async (url?: string) => {
    if (!url) return;
    const ok = await Linking.canOpenURL(url);
    if (!ok) return Alert.alert("Invalid link");
    Linking.openURL(url);
  };

  if (loading && !data) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: THEME.colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text
          style={{
            marginTop: 12,
            color: THEME.colors.text.secondary,
            fontWeight: "600",
          }}
        >
          {t("home.loadingHome")}
        </Text>
      </View>
    );
  }

  const cfg = data?.templeInfo;
  const socials = data?.socialLinks ?? [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: THEME.colors.background }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Decorative Header Background */}
      <View
        style={{
          height: 200,
          backgroundColor: THEME.colors.primary,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        />

        <Animated.View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Pressable
            onPress={() =>
              navigation.navigate("More", { screen: "SectionsSearch" })
            }
            style={{
              position: "absolute",
              right: 12,
              top: 6,
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: THEME.colors.surface,
              alignItems: "center",
              justifyContent: "center",
              ...THEME.shadows.md,
            }}
          >
            <Ionicons name="search" size={20} color={THEME.colors.primary} />
          </Pressable>

          <Image
            source={require("../../assets/title.png")}
            style={{ width: "90%", height: 60 }}
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/krishna.png")}
            style={{ width: "100%", height: 100 }}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <View style={{ padding: 16 }}>
        {/* Swamiji Images */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Card style={{ padding: 12 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <View
                  style={{
                    borderWidth: 3,
                    borderColor: THEME.colors.sacred.gold,
                    borderRadius: 16,
                    padding: 4,
                    backgroundColor: THEME.colors.surface,
                    ...THEME.shadows.temple,
                  }}
                >
                  <Image
                    source={require("../../assets/Vishwotham1.png")}
                    style={{ width: 100, height: 120, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                </View>
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    fontWeight: "700",
                    color: THEME.colors.text.secondary,
                    textAlign: "center",
                  }}
                >
                  H.H Sri Vishwothama{"\n"}Theertha Swamiji
                </Text>
              </View>

              <View style={{ flex: 1, alignItems: "center" }}>
                <View
                  style={{
                    borderWidth: 3,
                    borderColor: THEME.colors.sacred.saffron,
                    borderRadius: 16,
                    padding: 4,
                    backgroundColor: THEME.colors.surface,
                    ...THEME.shadows.temple,
                  }}
                >
                  <Image
                    source={require("../../assets/logo.png")}
                    style={{ width: 90, height: 120, borderRadius: 12 }}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    fontWeight: "700",
                    color: THEME.colors.text.secondary,
                    textAlign: "center",
                  }}
                >
                  Sri Sode{"\n"}Vadiraja Matha
                </Text>
              </View>

              <View style={{ flex: 1, alignItems: "center" }}>
                <View
                  style={{
                    borderWidth: 3,
                    borderColor: THEME.colors.sacred.gold,
                    borderRadius: 16,
                    padding: 4,
                    backgroundColor: THEME.colors.surface,
                    ...THEME.shadows.temple,
                  }}
                >
                  <Image
                    source={require("../../assets/Vishwavallabha1.png")}
                    style={{ width: 100, height: 120, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                </View>
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    fontWeight: "700",
                    color: THEME.colors.text.secondary,
                    textAlign: "center",
                  }}
                >
                  H.H Sri Vishwavallabha{"\n"}Theertha Swamiji
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <TempleDivider ornamental style={{ marginVertical: 20 }} />

        {/* Flash Updates - WITH AUTO-SCROLL */}
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: THEME.colors.text.primary,
              }}
            >
              {t("home.flashUpdates")}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Animated.View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: THEME.colors.success,
                  transform: [{ scale: pulseAnim }],
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: THEME.colors.text.secondary,
                  fontWeight: "600",
                }}
              >
                {t("home.live")}
              </Text>
            </View>
          </View>

          <ScrollView
            ref={flashScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onLayout={(e) => {
              flashViewW.current = e.nativeEvent.layout.width;
            }}
            onContentSizeChange={(w) => {
              flashContentW.current = w;
            }}
            onScroll={(e) => {
              flashX.current = e.nativeEvent.contentOffset.x;
            }}
            scrollEventThrottle={16}
            onTouchStart={() => {
              flashUserActive.current = true;
            }}
            onTouchEnd={() => {
              setTimeout(() => (flashUserActive.current = false), 800);
            }}
            onMomentumScrollBegin={() => {
              flashUserActive.current = true;
            }}
            onMomentumScrollEnd={() => {
              setTimeout(() => (flashUserActive.current = false), 800);
            }}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {(flashesText.length ? flashesText : [t("home.noUpdates")]).map(
              (text, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: THEME.colors.surface,
                    borderWidth: 2,
                    borderColor: THEME.colors.border.light,
                    borderLeftWidth: 4,
                    borderLeftColor: THEME.colors.sacred.saffron,
                    borderRadius: THEME.borderRadius.lg,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    marginRight: 12,
                    maxWidth: 280,
                    ...THEME.shadows.sm,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      lineHeight: 20,
                      color: THEME.colors.text.primary,
                    }}
                  >
                    {text}
                  </Text>
                </View>
              ),
            )}
          </ScrollView>
        </View>

        <TempleDivider ornamental style={{ marginVertical: 20 }} />

        {/* Darshan & Prasada Timings */}
        <Card>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: THEME.colors.text.primary,
              }}
            >
              {t("home.darshanPrasada")}
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            <TimingRow
              icon="🌅"
              label={t("home.morningDarshan")}
              time={cfg?.morningDarshan ?? "5:00 a.m. to 8:30 a.m."}
            />
            <TimingRow
              icon="🍽️"
              label={t("home.morningPrasada")}
              time={cfg?.morningPrasada ?? "Noon 11:30 a.m."}
            />

            <View
              style={{
                height: 1,
                backgroundColor: THEME.colors.border.light,
                marginVertical: 4,
              }}
            />

            <TimingRow
              icon="🌆"
              label={t("home.eveningDarshan")}
              time={cfg?.eveningDarshan ?? "5:00 p.m. to 7:30 p.m."}
            />
            <TimingRow
              icon="🍽️"
              label={t("home.eveningPrasada")}
              time={cfg?.eveningPrasada ?? "Evening 7:30 p.m."}
            />
          </View>
        </Card>

        <TempleDivider ornamental style={{ marginVertical: 20 }} />

        {/* Top News */}
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: THEME.colors.text.primary,
              marginBottom: 12,
            }}
          >
            {t("home.topNews")}
          </Text>

          {news.length === 0 ? (
            <Card>
              <View style={{ alignItems: "center", paddingVertical: 20 }}>
                <Text style={{ fontSize: 48, marginBottom: 8 }}>📰</Text>
                <Text
                  style={{
                    color: THEME.colors.text.secondary,
                    fontWeight: "600",
                  }}
                >
                  {t("home.noNews")}
                </Text>
              </View>
            </Card>
          ) : (
            <View style={{ position: "relative" }}>
              {newsIndex > 0 && (
                <Pressable
                  onPress={goPrev}
                  style={{
                    position: "absolute",
                    left: 8,
                    top: "45%",
                    zIndex: 10,
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: THEME.colors.surface,
                    alignItems: "center",
                    justifyContent: "center",
                    ...THEME.shadows.md,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "900",
                      color: THEME.colors.primary,
                    }}
                  >
                    ‹
                  </Text>
                </Pressable>
              )}

              <Animated.View
                style={{
                  opacity: newsOpacityAnim,
                  transform: [{ translateX: newsSlideAnim }],
                }}
              >
                <Pressable
                  onPress={() => openNews(news[newsIndex])}
                  style={{
                    backgroundColor: THEME.colors.surface,
                    borderRadius: THEME.borderRadius.xl,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: THEME.colors.border.light,
                    borderTopWidth: 4,
                    borderTopColor: THEME.colors.sacred.saffron,
                    ...THEME.shadows.lg,
                  }}
                >
                  <Image
                    source={{
                      uri:
                        news[newsIndex].imageUrl ||
                        "https://via.placeholder.com/400x200.png?text=No+Image"}}
                    style={{ width: "100%", height: 200 }}
                    resizeMode="cover"
                  />
                  <View style={{ padding: 16 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "800",
                        color: THEME.colors.text.primary,
                        lineHeight: 24,
                      }}
                    >
                      {news[newsIndex].title}
                    </Text>
                  </View>
                </Pressable>
              </Animated.View>

              {newsIndex < news.length - 1 && (
                <Pressable
                  onPress={goNext}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "45%",
                    zIndex: 10,
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: THEME.colors.surface,
                    alignItems: "center",
                    justifyContent: "center",
                    ...THEME.shadows.md,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "900",
                      color: THEME.colors.primary,
                    }}
                  >
                    ›
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        <TempleDivider ornamental style={{ marginVertical: 20 }} />

        {/* Social Links */}
        <Card>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: THEME.colors.overlay,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 20 }}>🔗</Text>
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: THEME.colors.text.primary,
              }}
            >
              {t("home.followUs")}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {socials.map((social) => (
              <Pressable
                key={social.id}
                onPress={() => openLink(social.url)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: THEME.borderRadius.md,
                  borderWidth: 2,
                  borderColor: THEME.colors.border.medium,
                  backgroundColor: THEME.colors.surface,
                }}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    color: THEME.colors.primary,
                  }}
                >
                  {social.platform}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>
      </View>

      <NewsDetailModal
        visible={newsModalOpen}
        onClose={() => setNewsModalOpen(false)}
        news={selectedNews}
      />
    </ScrollView>
  );
}

const TimingRow = ({
  icon,
  label,
  time,
}: {
  icon: string;
  label: string;
  time: string;
}) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={{ fontSize: 20, marginRight: 12 }}>{icon}</Text>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontWeight: "700",
          color: THEME.colors.text.primary,
          fontSize: 14,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: THEME.colors.text.secondary,
          fontSize: 13,
          marginTop: 2,
        }}
      >
        {time}
      </Text>
    </View>
  </View>
);
