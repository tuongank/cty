package com.cty.toolmaster.repository;

import com.cty.toolmaster.entity.ToolFHMaintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ToolFHMaintenanceRepository extends JpaRepository<ToolFHMaintenance, Integer> {
}
