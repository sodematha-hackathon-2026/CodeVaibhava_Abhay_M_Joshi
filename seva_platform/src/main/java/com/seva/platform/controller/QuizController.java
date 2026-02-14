package com.seva.platform.controller;


import com.seva.platform.dto.QuizDto;
import com.seva.platform.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService service;

    public QuizController(QuizService service) {
        this.service = service;
    }

    @GetMapping("/questions")
    public List<QuizDto.QuestionPublic> questions(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return service.getPublicQuestions(limit);
    }

    // ✅ submit requires userId from Firebase token
    @PostMapping("/submit")
    public QuizDto.SubmitResponse submit(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @Valid @RequestBody QuizDto.SubmitRequest req
    ) {
        return service.submit(req);
    }

    @GetMapping("/leaderboard")
    public List<QuizDto.LeaderboardRow> leaderboard(
            @RequestParam(defaultValue = "20") int limit
    ) {
        return service.leaderboard(limit);
    }
}
