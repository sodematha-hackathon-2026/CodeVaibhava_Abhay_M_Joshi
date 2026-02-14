package com.seva.platform.dto;


import com.seva.platform.model.CorrectOption;
import jakarta.validation.constraints.*;

import java.util.List;

public class QuizDto {

    public record QuestionPublic(
            String id,
            String questionText,
            List<String> options
    ) {}

    public record Answer(
            @NotBlank String questionId,
            @NotBlank String selected // "A" | "B" | "C" | "D"
    ) {}

    public record SubmitRequest(
            @NotEmpty List<Answer> answers
    ) {}

    public record SubmitResponse(
            String attemptId,
            String userUid,
            int score,
            int total,
            List<AnswerFeedback> feedback
    ) {}

    public record AnswerFeedback(
            String questionId,
            String userAnswer,      // A, B, C, D
            String correctAnswer,   // A, B, C, D
            boolean isCorrect
    ) {}

    public record LeaderboardRow(
            String userUid,
            String userName,
            int bestScore,
            int bestTotal,
            String lastAttemptAt
    ) {}

    // Admin
    public record QuestionUpsert(
            @NotBlank String questionText,
            @NotBlank String optionA,
            @NotBlank String optionB,
            @NotBlank String optionC,
            @NotBlank String optionD,
            @NotNull CorrectOption correctOption,
            @NotNull Boolean active
    ) {}

    public record QuestionAdmin(
            String id,
            String questionText,
            String optionA,
            String optionB,
            String optionC,
            String optionD,
            String correctOption,
            boolean active,
            String createdAt
    ) {}
}
