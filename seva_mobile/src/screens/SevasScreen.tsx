import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { api } from "../services/backend";
import { useAppConfig } from "../context/ConfigContext";
import DisabledModule from "../components/DisabledModule";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";
import { Button } from "../components/Button";

type Seva = {
  id: string;
  title: string;
  description?: string;
  amountInPaise: number;
  active: boolean;
};

export default function SevasScreen() {
  const { t } = useTranslation();
  const { config } = useAppConfig();
  const navigation = useNavigation<any>();
  
  const [loading, setLoading] = useState(true);
  const [sevas, setSevas] = useState<Seva[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  if (config && !config.enableSeva) 
    return <DisabledModule name={t('screens.sevas')} />;

  const load = async () => {
    setLoading(true);
    try {
      const data = await api<Seva[]>("/api/sevas", "GET");
      setSevas(data);
    } catch (e: any) {
      console.log("Sevas fetch error:", e?.message || e);
      Alert.alert(t('errors.error'), e?.message || "Failed to load sevas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
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
          {t('sevas.loadingSevas')}
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
      <View style={{ marginBottom: 16 }}>
        <Text style={{
          fontSize: 28,
          fontWeight: '800',
          color: THEME.colors.text.primary,
        }}>
          Temple Sevas
        </Text>
        <Text style={{
          fontSize: 14,
          color: THEME.colors.text.secondary,
          marginTop: 4,
        }}>
          Participate in sacred temple services
        </Text>
        <View style={{
          width: 60,
          height: 3,
          backgroundColor: THEME.colors.sacred.saffron,
          marginTop: 8,
          borderRadius: 2,
        }} />
      </View>

      <TempleDivider ornamental />

      {sevas.length === 0 ? (
        <Card>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🙏</Text>
            <Text style={{
              fontSize: 16,
              fontWeight: '700',
              color: THEME.colors.text.primary,
              marginBottom: 6,
            }}>
              {t('sevas.noSevas')}
            </Text>
            <Text style={{
              color: THEME.colors.text.secondary,
              textAlign: 'center',
              marginBottom: 16,
            }}>
              {t('sevas.askAdmin')}
            </Text>
            <Button
              onPress={load}
              title={t('common.retry')}
              variant="outline"
            />
          </View>
        </Card>
      ) : (
        <Animated.View style={{ opacity: fadeAnim }}>
          {sevas.map((seva, index) => (
            <SevaCard
              key={seva.id}
              seva={seva}
              index={index}
              onPress={() => navigation.navigate("SevaForm", { seva })}
            />
          ))}
        </Animated.View>
      )}
    </ScrollView>
  );
}

const SevaCard = ({
  seva,
  index,
  onPress,
}: {
  seva: Seva;
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

  return (
    <Animated.View style={{
      transform: [{ scale: scaleAnim }],
      marginBottom: 12,
    }}>
      <Card onPress={onPress}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{
              fontSize: 17,
              fontWeight: '800',
              color: THEME.colors.text.primary,
              marginBottom: 6,
            }}>
              {seva.title}
            </Text>
            {seva.description && (
              <Text style={{
                color: THEME.colors.text.secondary,
                fontSize: 13,
                lineHeight: 18,
              }}>
                {seva.description}
              </Text>
            )}
          </View>
          
          <View style={{
            backgroundColor: THEME.colors.overlay,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: THEME.borderRadius.md,
            borderLeftWidth: 3,
            borderLeftColor: THEME.colors.sacred.gold,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '800',
              color: THEME.colors.primary,
            }}>
              ₹{(seva.amountInPaise / 100).toFixed(0)}
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};