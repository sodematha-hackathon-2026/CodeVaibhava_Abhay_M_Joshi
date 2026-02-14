package com.seva.platform.controller.admin;

import com.seva.platform.dto.QuizDto;
import com.seva.platform.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/quiz")
public class AdminQuizController {

    private final QuizService service;

    public AdminQuizController(QuizService service) {
        this.service = service;
    }

    @GetMapping("/questions")
    public List<QuizDto.QuestionAdmin> listAll() {
        return service.listAll();
    }

    @PostMapping("/questions")
    public QuizDto.QuestionAdmin create(@Valid @RequestBody QuizDto.QuestionUpsert req) {
        return service.create(req);
    }

    @PutMapping("/questions/{id}")
    public QuizDto.QuestionAdmin update(@PathVariable String id, @Valid @RequestBody QuizDto.QuestionUpsert req) {
        return service.update(id, req);
    }

    @DeleteMapping("/questions/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
