package com.seva.platform.repository;

import com.seva.platform.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface NewsRepo extends JpaRepository<News, String> {
    @Query("select n from News n where n.active=true order by n.createdAt desc")
    List<News> findLatestActive();

}
