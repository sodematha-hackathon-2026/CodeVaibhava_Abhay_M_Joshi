package com.seva.platform.repository;

import com.seva.platform.model.PushToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PushTokenRepository extends JpaRepository<PushToken, String> {
    Optional<PushToken> findByToken(String token);
    List<PushToken> findByEnabledTrue();
}
