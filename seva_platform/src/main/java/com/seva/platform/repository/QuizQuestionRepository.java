package com.seva.platform.repository;


import com.seva.platform.model.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, String> {

    @Query(value = "select * from quiz_questions where active=true order by random() limit ?1", nativeQuery = true)
    List<QuizQuestion> findActiveRandomLimited(int limit);
}
