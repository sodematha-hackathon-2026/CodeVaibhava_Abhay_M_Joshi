import React, { useEffect, useState, useRef } from "react";
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
import { fetchAlbums, AlbumSummary } from "../services/galleryApi";
import { MoreStackParamList } from "../navigation/MoreStack";
import { useAppConfig } from "../context/ConfigContext";
import DisabledModule from "../components/DisabledModule";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";
import { Button } from "../components/Button";

type Props = NativeStackScreenProps<MoreStackParamList, "GalleryAlbums">;

export default function GalleryAlbumsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { config } = useAppConfig();
  
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState<AlbumSummary[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!loading && albums.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, albums]);

  if (config && !config.enableGallery) 
    return <DisabledModule name={t('screens.gallery')} />;

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAlbums();
      setAlbums(data.filter((a) => a.active));
    } catch (e: any) {
      console.log("Albums error:", e?.message || e);
      Alert.alert(t('errors.error'), "Failed to load albums");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
          {t('gallery.loadingAlbums')}
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
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}>
        <View>
          <Text style={{
            fontSize: 24,
            fontWeight: '800',
            color: THEME.colors.text.primary,
          }}>
            {t('gallery.title')}
          </Text>
          <View style={{
            width: 40,
            height: 3,
            backgroundColor: THEME.colors.sacred.saffron,
            marginTop: 4,
            borderRadius: 2,
          }} />
        </View>
        
        <Pressable
          onPress={load}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: THEME.colors.surface,
            borderRadius: THEME.borderRadius.md,
            borderWidth: 2,
            borderColor: THEME.colors.border.light,
            ...THEME.shadows.sm,
          }}
        >
          <Text style={{
            fontWeight: '700',
            color: THEME.colors.primary,
          }}>
            🔄 {t('common.refresh')}
          </Text>
        </Pressable>
      </View>

      <TempleDivider ornamental />

      {albums.length === 0 ? (
        <Card>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>📷</Text>
            <Text style={{
              fontSize: 16,
              fontWeight: '700',
              color: THEME.colors.text.primary,
              marginBottom: 6,
            }}>
              {t('gallery.noAlbums')}
            </Text>
            <Text style={{
              color: THEME.colors.text.secondary,
              textAlign: 'center',
            }}>
              Check back soon for temple gallery updates
            </Text>
          </View>
        </Card>
      ) : (
        <Animated.View style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          opacity: fadeAnim,
        }}>
          {albums.map((album, index) => (
            <AlbumCard
              key={album.id}
              album={album}
              index={index}
              onPress={() => navigation.navigate("GalleryAlbumDetail", { albumId: album.id })}
            />
          ))}
        </Animated.View>
      )}
    </ScrollView>
  );
}

const AlbumCard = ({
  album,
  index,
  onPress,
}: {
  album: AlbumSummary;
  index: number;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 100,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{
      width: "48%",
      marginBottom: 16,
      transform: [{ scale: scaleAnim }],
    }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          backgroundColor: THEME.colors.surface,
          borderRadius: THEME.borderRadius.lg,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: THEME.colors.border.light,
          borderTopWidth: 3,
          borderTopColor: THEME.colors.sacred.saffron,
          ...THEME.shadows.md,
        }}
      >
        <View style={{ position: 'relative' }}>
          <Image
            source={{
              uri: album.coverImageUrl || "https://via.placeholder.com/400x300.png?text=No+Cover+Image",
            }}
            style={{ width: "100%", height: 120 }}
            resizeMode="cover"
          />
          {/* Decorative overlay */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 40,
            backgroundColor: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
          }} />
        </View>
        
        <View style={{ padding: 12 }}>
          <Text style={{
            fontWeight: '700',
            fontSize: 15,
            color: THEME.colors.text.primary,
          }} numberOfLines={2}>
            {album.title}
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
          }}>
            <View style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: THEME.colors.sacred.saffron,
              marginRight: 6,
            }} />
            <Text style={{
              fontSize: 12,
              color: THEME.colors.text.secondary,
            }}>
              View Album
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};