package com.cty.toolmaster.repository;

import com.cty.toolmaster.entity.ToolFHStatusLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ToolFHStatusLogRepository extends JpaRepository<ToolFHStatusLog, Integer> {
}
