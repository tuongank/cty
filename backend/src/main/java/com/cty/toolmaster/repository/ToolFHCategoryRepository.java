package com.cty.toolmaster.repository;

import com.cty.toolmaster.entity.ToolFHCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ToolFHCategoryRepository extends JpaRepository<ToolFHCategory, Integer> {
    Optional<ToolFHCategory> findToolFHCategoryByName(String name);
}
