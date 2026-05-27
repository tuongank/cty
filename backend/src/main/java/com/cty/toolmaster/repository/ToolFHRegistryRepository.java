package com.cty.toolmaster.repository;

import com.cty.toolmaster.entity.ToolFHRegistry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ToolFHRegistryRepository extends JpaRepository<ToolFHRegistry, Integer> {
    Page<ToolFHRegistry> findBySerialNumberContainingIgnoreCase(String filter, Pageable pageable);
    Optional<ToolFHRegistry> findBySerialNumber(String serialNumber);
}
