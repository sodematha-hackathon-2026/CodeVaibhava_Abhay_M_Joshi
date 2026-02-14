package com.seva.platform.service;

import com.seva.platform.dto.PushDto;
import com.seva.platform.model.PushToken;
import com.seva.platform.repository.PushTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PushTokenService {
    private final PushTokenRepository repo;

    public PushTokenService(PushTokenRepository repo) { this.repo = repo; }

    @Transactional
    public void register(String uid, PushDto.RegisterRequest req) {
        PushToken t = repo.findByToken(req.token()).orElse(PushToken.builder().token(req.token()).build());
        t.setUserUid(uid);
        t.setEnabled(Boolean.TRUE.equals(req.enabled()));
        repo.save(t);
    }
}
