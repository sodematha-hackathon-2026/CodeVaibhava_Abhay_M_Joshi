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
import { submitQuiz, fetchQuizQuestions } from "../services/quizApi";
import type { QuizQuestion, AnswerFeedback } from "../services/quizApi";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";
import { Button } from "../components/Button";

type Props = NativeStackScreenProps<MoreStackParamList, "QuizResult">;

export default function QuizResultScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { answers } = route.params;

  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<{ score: number; total: number } | null>(null);
  const [feedback, setFeedback] = useState<AnswerFeedback[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    (async () => {
      try {
        const [res, qs] = await Promise.all([
          submitQuiz(answers),
          fetchQuizQuestions(answers.length),
        ]);
        
        setScore({ score: res.score, total: res.total });
        setFeedback(res.feedback || []);
        setQuestions(qs);
      } catch (e: any) {
        console.log("Submit quiz error:", e?.message || e);
        Alert.alert(t('errors.error'), e?.message || "Failed to submit quiz");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loading && score) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, score]);

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
          marginTop: 16,
          fontSize: 16,
          fontWeight: '700',
          color: THEME.colors.text.secondary,
        }}>
          {t('quiz.submitting')}
        </Text>
      </View>
    );
  }

  const percentage = score ? Math.round((score.score / score.total) * 100) : 0;
  const isPassing = percentage >= 60;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: THEME.colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
    >
      {/* Score Card */}
      <Animated.View style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}>
        <Card style={{
          borderWidth: 4,
          borderColor: isPassing 
            ? THEME.colors.success 
            : THEME.colors.warning,
          borderTopWidth: 8,
          alignItems: "center",
          paddingVertical: 24,
        }}>
          <Text style={{
            fontSize: 48,
            marginBottom: 12,
          }}>
            {isPassing ? "🎉" : "📚"}
          </Text>
          
          <Text style={{
            fontSize: 20,
            fontWeight: '800',
            color: THEME.colors.text.primary,
            marginBottom: 16,
            textAlign: 'center',
          }}>
            {isPassing ? t('quiz.greatJob') : t('quiz.keepPracticing')}
          </Text>
          
          {score && (
            <>
              <Text style={{
                fontSize: 56,
                fontWeight: '900',
                color: isPassing 
                  ? THEME.colors.success 
                  : THEME.colors.warning,
                marginBottom: 8,
              }}>
                {percentage}%
              </Text>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: THEME.colors.text.secondary,
              }}>
                {score.score} / {score.total} {t('quiz.correct')}
              </Text>
            </>
          )}
        </Card>
      </Animated.View>

      <TempleDivider ornamental style={{ marginVertical: 20 }} />

      {/* Answer Review */}
      {feedback.length > 0 && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '800',
            color: THEME.colors.text.primary,
            marginBottom: 16,
          }}>
            {t('quiz.reviewAnswers')}
          </Text>
          
          {feedback.map((item, index) => {
            const question = questions.find(q => q.id === item.questionId);
            if (!question) return null;

            return (
              <QuestionReviewCard
                key={item.questionId}
                item={item}
                question={question}
                index={index}
              />
            );
          })}
        </Animated.View>
      )}

      {/* Action Buttons */}
      <View style={{ marginTop: 20, gap: 12 }}>
        <Button
          onPress={() => navigation.replace("Quiz")}
          title={t('quiz.tryAgain')}
        />

        <Button
          onPress={() => navigation.navigate("QuizLeaderboard")}
          title={t('quiz.viewLeaderboard')}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

const QuestionReviewCard = ({
  item,
  question,
  index,
}: {
  item: AnswerFeedback;
  question: QuizQuestion;
  index: number;
}) => {
  const { t } = useTranslation();
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
      <Card style={{
        borderWidth: 3,
        borderColor: item.isCorrect 
          ? THEME.colors.success 
          : THEME.colors.error,
        borderLeftWidth: 6,
      }}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}>
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: item.isCorrect 
              ? THEME.colors.success 
              : THEME.colors.error,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}>
            <Text style={{
              color: THEME.colors.text.inverse,
              fontSize: 20,
              fontWeight: '900',
            }}>
              {item.isCorrect ? "✓" : "✗"}
            </Text>
          </View>
          <Text style={{
            fontSize: 16,
            fontWeight: '800',
            flex: 1,
            color: THEME.colors.text.primary,
          }}>
            {t('quiz.question')} {index + 1}
          </Text>
        </View>

        <Text style={{
          fontSize: 15,
          fontWeight: '700',
          color: THEME.colors.text.primary,
          marginBottom: 12,
          lineHeight: 22,
        }}>
          {question.questionText}
        </Text>

        {/* Options with feedback */}
        {["A", "B", "C", "D"].map((letter, i) => {
          const isUserAnswer = letter === item.userAnswer;
          const isCorrectAnswer = letter === item.correctAnswer;
          
          let backgroundColor = THEME.colors.surface;
          let borderColor = THEME.colors.border.light;
          let textColor = THEME.colors.text.primary;
          
          if (isCorrectAnswer) {
            backgroundColor = '#D1FAE5';
            borderColor = THEME.colors.success;
            textColor = '#065F46';
          } else if (isUserAnswer && !item.isCorrect) {
            backgroundColor = '#FEE2E2';
            borderColor = THEME.colors.error;
            textColor = '#991B1B';
          }

          return (
            <View
              key={letter}
              style={{
                marginTop: 8,
                borderWidth: 2,
                borderColor,
                backgroundColor,
                borderRadius: THEME.borderRadius.md,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{
                fontWeight: '800',
                color: textColor,
                flex: 1,
              }}>
                {letter}. {question.options[i]}
              </Text>
              {isCorrectAnswer && (
                <Text style={{ fontSize: 20 }}>✓</Text>
              )}
              {isUserAnswer && !item.isCorrect && (
                <Text style={{ fontSize: 20 }}>✗</Text>
              )}
            </View>
          );
        })}
      </Card>
    </Animated.View>
  );
};