import React, { useEffect, useMemo, useState, useRef } from "react";
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
import { fetchQuizQuestions } from "../services/quizApi";
import { useAppConfig } from "../context/ConfigContext";
import DisabledModule from "../components/DisabledModule";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";
import { Button } from "../components/Button";

type Props = NativeStackScreenProps<MoreStackParamList, "Quiz">;

const LETTERS = ["A", "B", "C", "D"] as const;

export default function QuizScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { config } = useAppConfig();
  
  const [loading, setLoading] = useState(true);
  const [qs, setQs] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  if (config && !config.enableQuiz) 
    return <DisabledModule name={t('screens.quiz')} />;

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchQuizQuestions(10);
      setQs(data);
      setIdx(0);
      setSelected(null);
      setAnswers({});
    } catch (e: any) {
      console.log("Quiz load error:", e?.message || e);
      Alert.alert(t('errors.error'), "Failed to load quiz questions.");
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
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, idx]);

  const current = qs[idx];

  useEffect(() => {
    if (!current) return;
    const prev = answers[current.id] || null;
    setSelected(prev);
    
        const progress = (idx + 1) / qs.length;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [idx, qs.length]);

  const total = qs.length;
  const isLast = idx === total - 1;

  const progressText = useMemo(() => {
    if (!total) return "";
    return `${t('quiz.question')} ${idx + 1} ${t('quiz.of')} ${total}`;
  }, [idx, total, t]);

  const choose = (letter: "A" | "B" | "C" | "D") => {
    setSelected(letter);
    setAnswers((p) => ({ ...p, [current.id]: letter }));
  };

  const next = () => {
    if (!selected) return Alert.alert(t('booking.selectOption'));
    setIdx((v) => Math.min(v + 1, total - 1));
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const submit = () => {
    if (!selected) return Alert.alert(t('booking.selectOption'));

    const list = Object.entries(answers).map(([questionId, selected]) => ({
      questionId,
      selected,
    }));

    if (list.length !== total) {
      return Alert.alert(t('quiz.incomplete'), t('quiz.answerAll'));
    }

    navigation.navigate("QuizResult", { answers: list });
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
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  if (!current) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: THEME.colors.background,
        padding: 16,
      }}>
        <Card>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>❓</Text>
            <Text style={{
              fontSize: 18,
              fontWeight: '800',
              color: THEME.colors.text.primary,
              marginBottom: 6,
            }}>
              {t('quiz.title')}
            </Text>
            <Text style={{
              color: THEME.colors.text.secondary,
              marginBottom: 16,
            }}>
              {t('quiz.noQuestions')}
            </Text>
            <Button
              onPress={load}
              title={t('common.refresh')}
            />
          </View>
        </Card>
      </View>
    );
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: THEME.colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
    >
      {/* Progress Bar */}
      <Card style={{ marginBottom: 16 }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '800',
          color: THEME.colors.text.primary,
          marginBottom: 8,
        }}>
          {t('quiz.title')}
        </Text>
        <Text style={{
          color: THEME.colors.text.secondary,
          fontWeight: '700',
          marginBottom: 12,
        }}>
          {progressText}
        </Text>
        
        <View style={{
          height: 8,
          backgroundColor: THEME.colors.border.light,
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <Animated.View style={{
            height: '100%',
            backgroundColor: THEME.colors.sacred.saffron,
            width: progressWidth,
          }} />
        </View>
      </Card>

      {/* Question Card */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Card>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: THEME.colors.overlay,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '800',
                color: THEME.colors.primary,
              }}>
                {idx + 1}
              </Text>
            </View>
            <Text style={{
              flex: 1,
              fontSize: 16,
              fontWeight: '800',
              color: THEME.colors.text.primary,
              lineHeight: 22,
            }}>
              {current.questionText}
            </Text>
          </View>

          <View style={{ gap: 10 }}>
            {LETTERS.map((L, i) => {
              const text = current.options?.[i] ?? "";
              const active = selected === L;

              return (
                <Pressable
                  key={L}
                  onPress={() => choose(L)}
                  style={{
                    borderWidth: 2,
                    borderColor: active 
                      ? THEME.colors.primary 
                      : THEME.colors.border.medium,
                    backgroundColor: active 
                      ? THEME.colors.primary 
                      : THEME.colors.surface,
                    borderRadius: THEME.borderRadius.md,
                    padding: 14,
                    ...THEME.shadows.sm,
                  }}
                >
                  <Text style={{
                    fontWeight: '700',
                    fontSize: 15,
                    color: active 
                      ? THEME.colors.text.inverse 
                      : THEME.colors.text.primary,
                  }}>
                    {L}. {text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      </Animated.View>

      {/* Navigation Buttons */}
      <View style={{ marginTop: 16, flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Button
            onPress={() => navigation.navigate("QuizLeaderboard")}
            title={t('quiz.leaderboard')}
            variant="secondary"
          />
        </View>

        <View style={{ flex: 1 }}>
          {isLast ? (
            <Button
              onPress={submit}
              title={t('common.submit')}
            />
          ) : (
            <Button
              onPress={next}
              title={t('common.next')}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}