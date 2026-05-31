package com.cty.toolmaster.repository;

import com.cty.toolmaster.entity.ToolFHRegistry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ToolFHRegistryRepository extends JpaRepository<ToolFHRegistry, Integer> {
    Page<ToolFHRegistry> findBySerialNumberContainingIgnoreCase(String filter, Pageable pageable);
    Optional<ToolFHRegistry> findBySerialNumber(String serialNumber);

    @Query("SELECT COUNT(r) FROM ToolFHRegistry r WHERE UPPER(r.status) LIKE '%ONLINE%' OR UPPER(r.status) LIKE '%ACTIVE%' OR UPPER(r.status) = 'OK'")
    long countOnlineTools();

    @Query("SELECT COUNT(r) FROM ToolFHRegistry r WHERE UPPER(r.status) LIKE '%PM%' OR UPPER(r.status) LIKE '%MAINT%'")
    long countPmTools();

    @Query("SELECT COUNT(r) FROM ToolFHRegistry r WHERE UPPER(r.status) LIKE '%SCRAP%'")
    long countScrapTools();

    @Query("SELECT COUNT(r) FROM ToolFHRegistry r WHERE UPPER(r.status) LIKE '%REPAIR%' OR UPPER(r.status) LIKE '%DOWN%' OR UPPER(r.status) LIKE '%FAIL%'")
    long countRepairTools();

    @Query("SELECT r.category.name, COUNT(r) FROM ToolFHRegistry r GROUP BY r.category.name")
    List<Object[]> countByCategory();
}
