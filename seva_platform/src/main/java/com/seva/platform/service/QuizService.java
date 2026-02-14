package com.seva.platform.service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.seva.platform.dto.QuizDto;
import com.seva.platform.model.QuizAttempt;
import com.seva.platform.model.QuizQuestion;
import com.seva.platform.repository.QuizAttemptRepository;
import com.seva.platform.repository.QuizQuestionRepository;
import com.seva.platform.security.AuthUser;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final QuizQuestionRepository questionRepo;
    private final QuizAttemptRepository attemptRepo;

    public QuizService(
            QuizQuestionRepository questionRepo,
            QuizAttemptRepository attemptRepo
    ) {
        this.questionRepo = questionRepo;
        this.attemptRepo = attemptRepo;
    }

    public List<QuizDto.QuestionPublic> getPublicQuestions(int limit) {
        int safeLimit = Math.min(Math.max(limit, 1), 25);
        List<QuizQuestion> qs = questionRepo.findActiveRandomLimited(safeLimit);
        return qs.stream().map(q -> new QuizDto.QuestionPublic(
                q.getId(),
                q.getQuestionText(),
                List.of(q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD())
        )).toList();
    }

    @Transactional
    public QuizDto.SubmitResponse submit(QuizDto.SubmitRequest req) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AuthUser)) {
            throw new RuntimeException("Not authenticated");
        }

        AuthUser authUser = (AuthUser) auth.getPrincipal();
        String uid = authUser.uid();
        String userName = getUserNameFromFirestore(uid);

        List<String> qids = req.answers().stream().map(QuizDto.Answer::questionId).toList();
        Map<String, QuizQuestion> map = questionRepo.findAllById(qids).stream()
                .collect(Collectors.toMap(QuizQuestion::getId, q -> q));

        int score = 0;
        int total = req.answers().size();
        List<QuizDto.AnswerFeedback> feedback = new ArrayList<>();  // ✅ Create feedback list

        for (QuizDto.Answer a : req.answers()) {
            QuizQuestion q = map.get(a.questionId());
            if (q == null) continue;

            String userAns = normalize(a.selected());
            String correctAns = q.getCorrectOption().name();
            boolean isCorrect = userAns.equalsIgnoreCase(correctAns);

            if (isCorrect) score += 1;

            // ✅ Add feedback for each answer
            feedback.add(new QuizDto.AnswerFeedback(
                    a.questionId(),
                    userAns,
                    correctAns,
                    isCorrect
            ));
        }

        QuizAttempt attempt = QuizAttempt.builder()
                .userUid(uid)
                .userName(userName)
                .score(score)
                .total(total)
                .createdAt(Instant.now())
                .build();

        attempt = attemptRepo.save(attempt);


        return new QuizDto.SubmitResponse(
                attempt.getId(),
                uid,
                score,
                total,
                feedback
        );
    }

    public List<QuizDto.LeaderboardRow> leaderboard(int limit) {
        int safeLimit = Math.min(Math.max(limit, 1), 50);

        return attemptRepo.findTopBestScores(safeLimit)
                .stream()
                .map(r -> new QuizDto.LeaderboardRow(
                        r.getUserUid(),
                        r.getUserName(),
                        r.getBestScore(),
                        r.getBestTotal(),
                        r.getLastAttemptAt().toString()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<QuizDto.QuestionAdmin> listAll() {
        return questionRepo.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toAdmin)
                .toList();
    }

    @Transactional
    public QuizDto.QuestionAdmin create(QuizDto.QuestionUpsert req) {
        QuizQuestion q = QuizQuestion.builder()
                .questionText(req.questionText())
                .optionA(req.optionA())
                .optionB(req.optionB())
                .optionC(req.optionC())
                .optionD(req.optionD())
                .correctOption(req.correctOption())
                .active(Boolean.TRUE.equals(req.active()))
                .createdAt(Instant.now())
                .build();

        return toAdmin(questionRepo.save(q));
    }

    @Transactional
    public QuizDto.QuestionAdmin update(String id, QuizDto.QuestionUpsert req) {
        QuizQuestion q = questionRepo.findById(id).orElseThrow(() -> new RuntimeException("Question not found: " + id));

        q.setQuestionText(req.questionText());
        q.setOptionA(req.optionA());
        q.setOptionB(req.optionB());
        q.setOptionC(req.optionC());
        q.setOptionD(req.optionD());
        q.setCorrectOption(req.correctOption());
        q.setActive(Boolean.TRUE.equals(req.active()));

        return toAdmin(questionRepo.save(q));
    }

    @Transactional
    public void delete(String id) {
        if (!questionRepo.existsById(id)) throw new RuntimeException("Question not found: " + id);
        questionRepo.deleteById(id);
    }

    private QuizDto.QuestionAdmin toAdmin(QuizQuestion q) {
        return new QuizDto.QuestionAdmin(
                q.getId(),
                q.getQuestionText(),
                q.getOptionA(),
                q.getOptionB(),
                q.getOptionC(),
                q.getOptionD(),
                q.getCorrectOption().name(),
                q.isActive(),
                q.getCreatedAt().toString()
        );
    }

    private String getUserNameFromFirestore(String uid) {
        try {
            Firestore db = FirestoreClient.getFirestore();
            var docSnap = db.collection("users").document(uid).get().get();

            if (docSnap.exists()) {
                String fullName = docSnap.getString("fullName");
                return (fullName != null && !fullName.isBlank()) ? fullName : "Anonymous";
            }
            return "Anonymous";
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Failed to fetch user name: " + e.getMessage());
            return "Anonymous";
        }
    }

    private String normalize(String s) {
        return s == null ? "" : s.trim().toUpperCase();
    }
}