package com.cty.toolmaster.repository;

import com.cty.toolmaster.entity.ToolFHScrap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ToolFHScrapRepository extends JpaRepository<ToolFHScrap, Integer> {
    @Query("SELECT s.reason, COUNT(s) FROM ToolFHScrap s GROUP BY s.reason ORDER BY COUNT(s) DESC")
    List<Object[]> countTopReasons();
}
