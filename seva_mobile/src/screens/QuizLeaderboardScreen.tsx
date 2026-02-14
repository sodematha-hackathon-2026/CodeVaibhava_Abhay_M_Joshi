import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MoreStackParamList } from "../navigation/MoreStack";
import { useTranslation } from "react-i18next";
import { fetchLeaderboard, LeaderboardRow } from "../services/quizApi";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";
import { Button } from "../components/Button";

type Props = NativeStackScreenProps<MoreStackParamList, "QuizLeaderboard">;

export default function QuizLeaderboardScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchLeaderboard(20);
      setRows(data);
    } catch (e: any) {
      console.log("Leaderboard error:", e?.message || e);
      Alert.alert(t('errors.error'), "Failed to load leaderboard");
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
          fontSize: 14,
          fontWeight: '700',
          color: THEME.colors.text.secondary,
        }}>
          {t('quiz.loadingLeaderboard')}
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
            🏆 {t('quiz.leaderboard')}
          </Text>
          <View style={{
            width: 60,
            height: 3,
            backgroundColor: THEME.colors.sacred.gold,
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
            fontWeight: '800',
            color: THEME.colors.primary,
          }}>
            🔄 {t('common.refresh')}
          </Text>
        </Pressable>
      </View>

      <TempleDivider ornamental />

      {rows.length === 0 ? (
        <Card style={{ marginTop: 16 }}>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🎯</Text>
            <Text style={{
              fontSize: 16,
              fontWeight: '700',
              color: THEME.colors.text.primary,
              marginBottom: 6,
            }}>
              {t('quiz.noAttempts')}
            </Text>
            <Text style={{
              color: THEME.colors.text.secondary,
              textAlign: "center",
            }}>
              {t('quiz.beFirst')}
            </Text>
          </View>
        </Card>
      ) : (
        <Animated.View style={{ marginTop: 16, opacity: fadeAnim }}>
          {rows.map((row, i) => (
            <LeaderboardCard key={`${row.userUid}-${i}`} row={row} index={i} />
          ))}
        </Animated.View>
      )}

      <Button
        onPress={() => navigation.navigate("Quiz")}
        title={t('quiz.startQuiz')}
        style={{ marginTop: 16 }}
      />
    </ScrollView>
  );
}

const LeaderboardCard = ({ row, index }: { row: LeaderboardRow; index: number }) => {
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

  const getMedal = (i: number) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return null;
  };

  const medal = getMedal(index);
  const percentage = Math.round((row.bestScore / row.bestTotal) * 100);

  return (
    <Animated.View style={{
      transform: [{ scale: scaleAnim }],
      marginBottom: 10,
    }}>
      <Card style={{
        borderLeftWidth: 5,
        borderLeftColor: medal 
          ? THEME.colors.sacred.gold 
          : THEME.colors.border.medium,
      }}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
        }}>
          <View style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: medal 
              ? THEME.colors.overlay 
              : THEME.colors.border.light,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 14,
            borderWidth: medal ? 2 : 0,
            borderColor: THEME.colors.sacred.gold,
          }}>
            {medal ? (
              <Text style={{ fontSize: 24 }}>{medal}</Text>
            ) : (
              <Text style={{
                fontSize: 18,
                fontWeight: '900',
                color: THEME.colors.text.secondary,
              }}>
                {index + 1}
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '800',
              color: THEME.colors.text.primary,
              marginBottom: 4,
            }}>
              {row.userName || "Anonymous"}
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: THEME.colors.text.secondary,
            }}>
              {row.bestScore}/{row.bestTotal} {t('quiz.correct')} • {percentage}%
            </Text>
          </View>

          <View style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: THEME.borderRadius.md,
            backgroundColor: percentage >= 60 
              ? THEME.colors.success 
              : THEME.colors.error,
          }}>
            <Text style={{
              color: THEME.colors.text.inverse,
              fontWeight: '900',
              fontSize: 14,
            }}>
              {percentage}%
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};