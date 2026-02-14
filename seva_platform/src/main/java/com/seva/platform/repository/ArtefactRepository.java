package com.seva.platform.repository;


import com.seva.platform.model.Artefact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArtefactRepository extends JpaRepository<Artefact, String> {

    List<Artefact> findAllByOrderByCreatedAtDesc();

    List<Artefact> findByCategoryIgnoreCaseOrderByCreatedAtDesc(String category);

    List<Artefact> findByTypeIgnoreCaseOrderByCreatedAtDesc(String type);

    List<Artefact> findByCategoryIgnoreCaseAndTypeIgnoreCaseOrderByCreatedAtDesc(String category, String type);
}
