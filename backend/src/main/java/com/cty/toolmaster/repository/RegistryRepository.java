package com.cty.toolmaster.repository;

import com.cty.toolmaster.entity.Registry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistryRepository extends JpaRepository<Registry, Long> {
    
    Page<Registry> findBySerialNumberContainingIgnoreCase(String filter, Pageable pageable);
}
