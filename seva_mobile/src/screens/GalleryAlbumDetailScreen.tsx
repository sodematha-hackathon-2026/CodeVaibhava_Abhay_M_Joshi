import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { fetchAlbum, AlbumDetail, MediaItem } from "../services/galleryApi";
import GalleryMediaViewer from "../components/GalleryMediaViewer";
import { MoreStackParamList } from "../navigation/MoreStack";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";
import { Button } from "../components/Button";

type Props = NativeStackScreenProps<MoreStackParamList, "GalleryAlbumDetail">;

export default function GalleryAlbumDetailScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { albumId } = route.params;

  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState<AlbumDetail | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAlbum(albumId);
      setAlbum(data);
      navigation.setOptions({ title: data.title });
    } catch (e: any) {
      console.log("Album error:", e?.message || e);
      Alert.alert(t('errors.error'), "Failed to load album");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [albumId]);

  useEffect(() => {
    if (!loading && album) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, album]);

  const media = useMemo(() => album?.media ?? [], [album]);

  const openItem = (m: MediaItem) => {
    setSelected(m);
    setViewerOpen(true);
  };

  if (loading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: THEME.colors.background,
        alignItems: "center",
        justifyContent: "center",
      }}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={{
          marginTop: 12,
          color: THEME.colors.text.secondary,
          fontWeight: '600',
        }}>
          {t('gallery.loading')}
        </Text>
      </View>
    );
  }

  if (!album) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: THEME.colors.background,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}>
        <Text style={{
          fontSize: 48,
          marginBottom: 12,
        }}>📷</Text>
        <Text style={{
          color: THEME.colors.text.secondary,
          fontWeight: '600',
        }}>
          {t('gallery.albumNotFound')}
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: THEME.colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Album Header */}
          <Card style={{
            padding: 0,
            overflow: 'hidden',
            borderTopWidth: 6,
            borderTopColor: THEME.colors.sacred.saffron,
          }}>
            <Image
              source={{
                uri: album.coverImageUrl || "https://via.placeholder.com/600x300.png?text=No+Cover+Image",
              }}
              style={{ width: "100%", height: 180 }}
              resizeMode="cover"
            />
            <View style={{ padding: 16 }}>
              <Text style={{
                fontSize: 22,
                fontWeight: '800',
                color: THEME.colors.text.primary,
                marginBottom: 8,
              }}>
                {album.title}
              </Text>
              {album.description && (
                <Text style={{
                  color: THEME.colors.text.secondary,
                  lineHeight: 20,
                  marginBottom: 12,
                }}>
                  {album.description}
                </Text>
              )}
              <Button
                onPress={load}
                title={t('common.refresh')}
                variant="secondary"
              />
            </View>
          </Card>

          <TempleDivider ornamental style={{ marginVertical: 20 }} />

          {/* Media Grid */}
          <Text style={{
            fontSize: 18,
            fontWeight: '800',
            color: THEME.colors.text.primary,
            marginBottom: 12,
          }}>
            {t('gallery.media')}
          </Text>

          {media.length === 0 ? (
            <Card>
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Text style={{ fontSize: 48, marginBottom: 8 }}>📸</Text>
                <Text style={{
                  color: THEME.colors.text.secondary,
                  fontWeight: '600',
                }}>
                  {t('gallery.noMedia')}
                </Text>
              </View>
            </Card>
          ) : (
            <View style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}>
              {media.map((m, index) => (
                <MediaCard
                  key={m.id}
                  media={m}
                  index={index}
                  onPress={() => openItem(m)}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <GalleryMediaViewer
        visible={viewerOpen}
        onClose={() => setViewerOpen(false)}
        item={selected}
      />
    </>
  );
}

const MediaCard = ({
  media,
  index,
  onPress,
}: {
  media: MediaItem;
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
      width: "48%",
      marginBottom: 12,
      transform: [{ scale: scaleAnim }],
    }}>
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: THEME.colors.surface,
          borderRadius: THEME.borderRadius.lg,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: THEME.colors.border.light,
          ...THEME.shadows.md,
        }}
      >
        <View style={{ position: 'relative' }}>
          <Image
            source={{
              uri:
                media.thumbnailUrl ||
                (media.type === "IMAGE"
                  ? media.url
                  : "https://via.placeholder.com/400x300.png?text=No+Thumbnail")}}
            style={{ width: "100%", height: 120 }}
            resizeMode="cover"
          />
          {media.type === "VIDEO" && (
            <View style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: 12,
              padding: 4,
            }}>
              <Text style={{ color: 'white', fontSize: 20 }}>▶️</Text>
            </View>
          )}
        </View>
        
        <View style={{ padding: 10 }}>
          <Text style={{
            fontWeight: '700',
            fontSize: 13,
            color: THEME.colors.text.primary,
          }} numberOfLines={2}>
            {media.title || (media.type === "VIDEO" ? "Video" : "Image")}
          </Text>
          <View style={{
            marginTop: 4,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: THEME.borderRadius.sm,
            backgroundColor: THEME.colors.overlay,
            alignSelf: 'flex-start',
          }}>
            <Text style={{
              color: THEME.colors.primary,
              fontSize: 10,
              fontWeight: '700',
            }}>
              {media.type}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};