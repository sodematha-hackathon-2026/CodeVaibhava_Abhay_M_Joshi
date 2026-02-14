package com.seva.platform.repository;


import com.seva.platform.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, String> {

    @Query(value = """
    SELECT 
      a.user_uid as userUid,
      a.user_name as userName,
      a.score as bestScore,
      a.total as bestTotal,
      a.created_at as lastAttemptAt
    FROM quiz_attempts a
    INNER JOIN (
      SELECT user_uid, MAX(created_at) as max_date
      FROM quiz_attempts
      GROUP BY user_uid
    ) b ON a.user_uid = b.user_uid AND a.created_at = b.max_date
    ORDER BY a.score DESC, a.created_at DESC
    LIMIT ?1
  """, nativeQuery = true)
    List<LeaderboardProjection> findTopBestScores(int limit);
}
