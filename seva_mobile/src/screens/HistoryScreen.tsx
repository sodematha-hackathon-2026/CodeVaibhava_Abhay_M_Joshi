import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { useTranslation } from "react-i18next";
import { fetchHistory, HistoryItem } from "../services/historyApi";
import { useAppConfig } from "../context/ConfigContext";
import DisabledModule from "../components/DisabledModule";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";

export default function HistoryScreen() {
  const { t } = useTranslation();
  const { config } = useAppConfig();
  
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<HistoryItem[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  if (config && !config.enableHistory) 
    return <DisabledModule name={t('screens.history')} />;

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHistory();
        setItems(data);
      } catch (e: any) {
        console.log("History load error:", e?.message || e);
        Alert.alert(t('errors.error'), "Failed to load history");
      } finally {
        setLoading(false);
      }
    })();
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
          {t('history.loading')}
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
      <Card style={{
        borderTopWidth: 6,
        borderTopColor: THEME.colors.sacred.sandalwood,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <View style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: THEME.colors.overlay,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <Text style={{ fontSize: 24 }}>📜</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '800',
              color: THEME.colors.text.primary,
            }}>
              {t('history.title')}
            </Text>
          </View>
        </View>
        <Text style={{
          color: THEME.colors.text.secondary,
          lineHeight: 20,
        }}>
          {t('history.description')}
        </Text>
      </Card>

      <TempleDivider ornamental style={{ marginVertical: 20 }} />

      {/* Timeline */}
      <Animated.View style={{ opacity: fadeAnim }}>
        {items.length === 0 ? (
          <Card>
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <Text style={{ fontSize: 48, marginBottom: 8 }}>📜</Text>
              <Text style={{
                color: THEME.colors.text.secondary,
                fontWeight: '600',
              }}>
                {t('history.noHistory')}
              </Text>
            </View>
          </Card>
        ) : (
          items.map((item, idx) => (
            <HistoryTimelineItem
              key={item.id}
              item={item}
              index={idx}
              isLast={idx === items.length - 1}
            />
          ))
        )}
      </Animated.View>
    </ScrollView>
  );
}

const HistoryTimelineItem = ({
  item,
  index,
  isLast,
}: {
  item: HistoryItem;
  index: number;
  isLast: boolean;
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

  return (
    <Animated.View style={{
      flexDirection: "row",
      gap: 14,
      marginBottom: 16,
      transform: [{ scale: scaleAnim }],
    }}>
      {/* Timeline indicator */}
      <View style={{ width: 24, alignItems: "center" }}>
        <View style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: THEME.colors.sacred.saffron,
          marginTop: 8,
          borderWidth: 3,
          borderColor: THEME.colors.sacred.gold,
        }} />
        {!isLast && (
          <View style={{
            flex: 1,
            width: 2,
            backgroundColor: THEME.colors.border.medium,
            marginTop: 6,
          }} />
        )}
      </View>

      {/* Content Card */}
      <View style={{ flex: 1 }}>
        <Card>
          {item.imageUrl && (
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                width: "100%",
                height: 160,
                borderRadius: THEME.borderRadius.md,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: THEME.colors.border.light,
              }}
              resizeMode="cover"
            />
          )}

          <Text style={{
            fontSize: 17,
            fontWeight: '800',
            color: THEME.colors.text.primary,
            marginBottom: 6,
          }}>
            {item.title}
          </Text>

          {(item.subtitle || item.period) && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: 12,
            }}>
              {item.subtitle && (
                <Text style={{
                  fontSize: 13,
                  color: THEME.colors.text.secondary,
                  fontWeight: '600',
                }}>
                  {item.subtitle}
                </Text>
              )}
              {item.subtitle && item.period && (
                <View style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: THEME.colors.text.tertiary,
                  marginHorizontal: 8,
                }} />
              )}
              {item.period && (
                <View style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: THEME.borderRadius.sm,
                  backgroundColor: THEME.colors.overlay,
                }}>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: THEME.colors.primary,
                  }}>
                    {item.period}
                  </Text>
                </View>
              )}
            </View>
          )}

          {item.description && (
            <Text style={{
              color: THEME.colors.text.secondary,
              lineHeight: 22,
              fontSize: 14,
            }}>
              {item.description}
            </Text>
          )}
        </Card>
      </View>
    </Animated.View>
  );
};