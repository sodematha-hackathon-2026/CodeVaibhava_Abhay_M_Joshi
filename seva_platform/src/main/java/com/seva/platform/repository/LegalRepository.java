package com.seva.platform.repository;


import com.seva.platform.model.LegalContent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LegalRepository extends JpaRepository<LegalContent, Integer> {}
