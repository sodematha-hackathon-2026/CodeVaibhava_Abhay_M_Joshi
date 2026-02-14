import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  TextInput,
  Image,
  Animated,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Audio } from "expo-av";
import { useTranslation } from "react-i18next";
import { fetchArtefacts, Artefact } from "../services/artefactsApi";
import { Ionicons } from "@expo/vector-icons";
import { useAppConfig } from "../context/ConfigContext";
import DisabledModule from "../components/DisabledModule";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";
import { Button } from "../components/Button";

export default function ArtefactsScreen() {
  const { t } = useTranslation();
  const { config } = useAppConfig();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Artefact[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"ALL" | "PDF" | "AUDIO">("ALL");

  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playLoading, setPlayLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  if (config && !config.enableArtefacts)
    return <DisabledModule name={t("screens.artefacts")} />;

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchArtefacts({
        category: category.trim() ? category.trim() : undefined,
        type: type === "ALL" ? undefined : type,
      });
      setItems((data || []).filter((x) => x.active));
    } catch (e: any) {
      console.log("Artefacts load error:", e?.message || e);
      Alert.alert(t("errors.error"), "Failed to load artefacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    return () => {
      soundRef.current?.unloadAsync?.().catch(() => {});
      soundRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  const openPdf = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {
      Alert.alert("PDF", "Unable to open PDF.");
    }
  };

  const stopAudio = async () => {
    try {
      setPlayLoading(true);
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setPlayingId(null);
      setIsPlaying(false);
    } catch {
    } finally {
      setPlayLoading(false);
    }
  };

  const toggleAudio = async (item: Artefact) => {
    try {
      setPlayLoading(true);

      if (playingId === item.id && soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else if (status.isLoaded) {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
        return;
      }

      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: item.url },
        { shouldPlay: true },
      );

      soundRef.current = sound;
      setPlayingId(item.id);
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;

        if (status.didJustFinish) {
          stopAudio();
        }

        if (!status.isPlaying && status.positionMillis > 0) {
          setIsPlaying(false);
        }
      });
    } catch (e: any) {
      console.log("Audio error:", e?.message || e);
      Alert.alert(
        "Audio",
        "Unable to play audio. Check file URL / Storage rules.",
      );
    } finally {
      setPlayLoading(false);
    }
  };

  const countText = useMemo(
    () => `${items.length} ${t("artefacts.items")}`,
    [items.length, t],
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: THEME.colors.background,
          alignItems: "center",
          justifyContent: "center",
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
          {t("common.loading")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: THEME.colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
    >
      {/* Header */}
      <Card
        style={{
          borderTopWidth: 6,
          borderTopColor: THEME.colors.sacred.sandalwood,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
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
            <Text style={{ fontSize: 20 }}>📚</Text>
          </View>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              color: THEME.colors.text.primary,
            }}
          >
            {t("artefacts.title")}
          </Text>
        </View>
        <Text
          style={{
            color: THEME.colors.text.secondary,
            lineHeight: 20,
          }}
        >
          {t("artefacts.description")}
        </Text>
      </Card>

      <TempleDivider ornamental style={{ marginVertical: 16 }} />

      {/* Count & Filter Toggle */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "800",
            color: THEME.colors.text.primary,
          }}
        >
          {countText}
        </Text>

        <Pressable
          onPress={() => setFilterOpen((v) => !v)}
          style={{
            backgroundColor: THEME.colors.surface,
            borderWidth: 2,
            borderColor: THEME.colors.border.light,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: THEME.borderRadius.md,
            ...THEME.shadows.sm,
          }}
        >
          <Text
            style={{
              fontWeight: "800",
              color: THEME.colors.primary,
            }}
          >
            {filterOpen ? t("events.closeFilters") : t("common.filters")}
          </Text>
        </Pressable>
      </View>

      {/* Filters */}
      {filterOpen && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Card style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontWeight: "800",
                fontSize: 16,
                color: THEME.colors.text.primary,
                marginBottom: 12,
              }}
            >
              {t("artefacts.category")}
            </Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. Stotra, Lecture"
              placeholderTextColor={THEME.colors.text.tertiary}
              style={{
                borderWidth: 2,
                borderColor: THEME.colors.border.medium,
                borderRadius: THEME.borderRadius.md,
                padding: 12,
                backgroundColor: THEME.colors.surface,
                color: THEME.colors.text.primary,
                marginBottom: 16,
              }}
            />

            <Text
              style={{
                fontWeight: "800",
                fontSize: 16,
                color: THEME.colors.text.primary,
                marginBottom: 12,
              }}
            >
              {t("artefacts.type")}
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
              {(["ALL", "PDF", "AUDIO"] as const).map((t_type) => {
                const active = type === t_type;
                return (
                  <Pressable
                    key={t_type}
                    onPress={() => setType(t_type)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: THEME.borderRadius.md,
                      borderWidth: 2,
                      borderColor: active
                        ? THEME.colors.primary
                        : THEME.colors.border.medium,
                      backgroundColor: active
                        ? THEME.colors.primary
                        : THEME.colors.surface,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "800",
                        color: active
                          ? THEME.colors.text.inverse
                          : THEME.colors.text.primary,
                      }}
                    >
                      {t_type === "ALL"
                        ? t("artefacts.all")
                        : t_type === "PDF"
                          ? t("artefacts.pdf")
                          : t("artefacts.audio")}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Button onPress={load} title={t("common.apply")} />
              </View>

              <View style={{ flex: 1 }}>
                <Button
                  onPress={() => {
                    setCategory("");
                    setType("ALL");
                    fetchArtefacts({
                      category: undefined,
                      type: undefined,
                    })
                      .then((data) => {
                        setItems((data || []).filter((x) => x.active));
                      })
                      .catch((e: any) => {
                        console.log("Reset error:", e?.message || e);
                        Alert.alert(
                          t("errors.error"),
                          "Failed to reset filters",
                        );
                      });
                  }}
                  title={t("common.reset")}
                  variant="secondary"
                />
              </View>
            </View>
          </Card>
        </Animated.View>
      )}

      {/* Artefacts List */}
      <View>
        {loading ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 30,
            }}
          >
            <ActivityIndicator color={THEME.colors.primary} />
            <Text
              style={{
                marginTop: 10,
                color: THEME.colors.text.secondary,
              }}
            >
              {t("common.loading")}
            </Text>
          </View>
        ) : items.length === 0 ? (
          <Card>
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Text style={{ fontSize: 48, marginBottom: 8 }}>📚</Text>
              <Text
                style={{
                  color: THEME.colors.text.secondary,
                  fontWeight: "600",
                }}
              >
                {t("artefacts.noArtefacts")}
              </Text>
            </View>
          </Card>
        ) : (
          items.map((artefact, index) => (
            <ArtefactCard
              key={artefact.id}
              artefact={artefact}
              index={index}
              playingId={playingId}
              isPlaying={isPlaying}
              playLoading={playLoading}
              onOpenPdf={openPdf}
              onToggleAudio={toggleAudio}
              onStopAudio={stopAudio}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const ArtefactCard = ({
  artefact,
  index,
  playingId,
  isPlaying,
  playLoading,
  onOpenPdf,
  onToggleAudio,
  onStopAudio,
}: {
  artefact: Artefact;
  index: number;
  playingId: string | null;
  isPlaying: boolean;
  playLoading: boolean;
  onOpenPdf: (url: string) => void;
  onToggleAudio: (artefact: Artefact) => void;
  onStopAudio: () => void;
}) => {
  const { t } = useTranslation();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 80,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        marginBottom: 12,
      }}
    >
      <Card>
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
          {artefact.thumbnailUrl ? (
            <Image
              source={{ uri: artefact.thumbnailUrl }}
              style={{
                width: 60,
                height: 60,
                borderRadius: THEME.borderRadius.md,
                borderWidth: 2,
                borderColor: THEME.colors.border.light,
              }}
            />
          ) : artefact.type === "PDF" ? (
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: THEME.borderRadius.md,
                backgroundColor: "#FFEBEE",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#E53935",
              }}
            >
              <Ionicons name="document-text" size={32} color="#E53935" />
            </View>
          ) : (
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: THEME.borderRadius.md,
                backgroundColor: "#E3F2FD",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#0f69c4",
              }}
            >
              <Ionicons name="musical-notes" size={32} color="#0f69c4" />
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontWeight: "800",
                fontSize: 15,
                color: THEME.colors.text.primary,
                marginBottom: 4,
              }}
              numberOfLines={2}
            >
              {artefact.title}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: THEME.borderRadius.sm,
                  backgroundColor: THEME.colors.overlay,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: THEME.colors.primary,
                  }}
                >
                  {artefact.category}
                </Text>
              </View>
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: THEME.colors.text.tertiary,
                }}
              />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: THEME.colors.text.secondary,
                }}
              >
                {artefact.type}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          {artefact.type === "PDF" ? (
            <View style={{ flex: 1 }}>
              <Button
                onPress={() => onOpenPdf(artefact.url)}
                title={t("artefacts.openPdf")}
              />
            </View>
          ) : (
            <>
              <View style={{ flex: 1 }}>
                <Button
                  onPress={() => onToggleAudio(artefact)}
                  title={
                    playingId === artefact.id
                      ? isPlaying
                        ? t("artefacts.pause")
                        : t("artefacts.play")
                      : t("artefacts.play")
                  }
                  variant={playingId === artefact.id ? "secondary" : "primary"}
                  disabled={playLoading}
                  loading={playLoading}
                />
              </View>

              {playingId === artefact.id && (
                <Pressable
                  onPress={onStopAudio}
                  disabled={playLoading}
                  style={{
                    paddingHorizontal: 16,
                    borderRadius: THEME.borderRadius.md,
                    borderWidth: 2,
                    borderColor: THEME.colors.border.medium,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: THEME.colors.surface,
                    opacity: playLoading ? 0.6 : 1,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "800",
                      color: THEME.colors.error,
                    }}
                  >
                    {t("artefacts.stop")}
                  </Text>
                </Pressable>
              )}
            </>
          )}
        </View>
      </Card>
    </Animated.View>
  );
};
