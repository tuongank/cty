package com.cty.toolmaster.repository;

import com.cty.toolmaster.entity.ToolFHType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ToolFHTypeRepository extends JpaRepository<ToolFHType, Integer> {
    Optional<ToolFHType> findByTypeCodeAndCategoryId(String typeCode, Integer categoryId);
    Optional<ToolFHType> findByTypeCodeAndCategory_Name(String typeCode, String categoryName);
}
