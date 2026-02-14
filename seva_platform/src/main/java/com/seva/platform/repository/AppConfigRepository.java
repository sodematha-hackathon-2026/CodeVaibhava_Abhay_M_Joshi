package com.seva.platform.repository;


import com.seva.platform.model.AppConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppConfigRepository extends JpaRepository<AppConfig, Integer> {}
