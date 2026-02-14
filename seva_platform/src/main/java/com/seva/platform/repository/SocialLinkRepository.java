package com.seva.platform.repository;

import com.seva.platform.model.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SocialLinkRepository extends JpaRepository<SocialLink, String> {
    List<SocialLink> findByActiveTrueOrderByCreatedAtDesc();
}