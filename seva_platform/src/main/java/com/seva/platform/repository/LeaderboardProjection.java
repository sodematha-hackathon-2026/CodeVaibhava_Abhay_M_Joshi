package com.seva.platform.repository;

import java.time.Instant;

public interface LeaderboardProjection {
    String getUserUid();
    String getUserName();
    Integer getBestScore();
    Integer getBestTotal();
    Instant getLastAttemptAt();
}
