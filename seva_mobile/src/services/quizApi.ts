import auth from "@react-native-firebase/auth";
import { api } from "./backend";

export type QuizQuestion = {
  id: string;
  questionText: string;
  options: string[]; };

export type QuizSubmitResp = {
  attemptId: string;
  userUid: string;
  score: number;
  total: number;
  feedback: AnswerFeedback[];
};

export type LeaderboardRow = {
  userUid: string;
  userName: string;  
  bestScore: number;
  bestTotal: number;
  lastAttemptAt: string;
};


export type AnswerFeedback = {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

export async function fetchQuizQuestions(limit = 10): Promise<QuizQuestion[]> {
  return api<QuizQuestion[]>(`/api/quiz/questions?limit=${limit}`, "GET");
}

export async function submitQuiz(answers: { questionId: string; selected: "A" | "B" | "C" | "D" }[]) {
    return api<QuizSubmitResp>("/api/quiz/submit", "POST", { answers });
}

export async function fetchLeaderboard(limit = 20): Promise<LeaderboardRow[]> {
  return api<LeaderboardRow[]>(`/api/quiz/leaderboard?limit=${limit}`, "GET");
}