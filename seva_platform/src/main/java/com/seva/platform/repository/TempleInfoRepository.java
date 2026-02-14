package com.seva.platform.repository;

import com.seva.platform.model.MathaInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TempleInfoRepository extends JpaRepository<MathaInfo, String> {}