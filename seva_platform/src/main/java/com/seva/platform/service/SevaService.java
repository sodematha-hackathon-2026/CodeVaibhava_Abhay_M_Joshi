package com.seva.platform.service;

import com.seva.platform.model.Seva;
import com.seva.platform.repository.SevaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SevaService {
    private final SevaRepository repo;
    public SevaService(SevaRepository repo){ this.repo = repo; }

    public List<Seva> listActiveSevas() {
        return repo.findByActiveTrueOrderByCreatedAtDesc();
    }
}
