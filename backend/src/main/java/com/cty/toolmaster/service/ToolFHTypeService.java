package com.cty.toolmaster.service;

import com.cty.toolmaster.dto.ToolFHTypeRequestDto;
import com.cty.toolmaster.dto.ToolFHTypeResponse;
import com.cty.toolmaster.entity.ToolFHCategory;
import com.cty.toolmaster.entity.ToolFHType;
import com.cty.toolmaster.repository.ToolFHCategoryRepository;
import com.cty.toolmaster.repository.ToolFHTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ToolFHTypeService {
    private final ToolFHTypeRepository toolFHTypeRepository;
    private final ToolFHCategoryRepository categoryRepository;

    public List<ToolFHTypeResponse> getAll() {
        return toolFHTypeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ToolFHTypeResponse createToolFHType(ToolFHTypeRequestDto request) {
        if (toolFHTypeRepository.findByTypeCodeAndCategoryId(request.getTypeCode(), request.getCategoryId()).isPresent()) {
            throw new IllegalArgumentException("Type already exists in this category");
        }
        
        ToolFHCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        ToolFHType toolFHType = ToolFHType.builder()
                .category(category)
                .typeCode(request.getTypeCode())
                .build();
        ToolFHType saved = toolFHTypeRepository.save(toolFHType);
        return mapToResponse(saved);
    }

    @Transactional
    public ToolFHTypeResponse updateToolFHType(Integer id, ToolFHTypeRequestDto request) {
        ToolFHType existing = toolFHTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Type not found"));

        if (!existing.getTypeCode().equals(request.getTypeCode()) || !existing.getCategory().getId().equals(request.getCategoryId())) {
            if (toolFHTypeRepository.findByTypeCodeAndCategoryId(request.getTypeCode(), request.getCategoryId()).isPresent()) {
                throw new IllegalArgumentException("Type already exists in this category");
            }
        }

        ToolFHCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        existing.setCategory(category);
        existing.setTypeCode(request.getTypeCode());
        ToolFHType saved = toolFHTypeRepository.save(existing);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteToolFHType(Integer id) {
        if (!toolFHTypeRepository.existsById(id)) {
            throw new IllegalArgumentException("Type not found");
        }
        toolFHTypeRepository.deleteById(id);
    }

    private ToolFHTypeResponse mapToResponse(ToolFHType saved) {
        return ToolFHTypeResponse.builder()
                .id(saved.getId())
                .categoryId(saved.getCategory().getId())
                .categoryName(saved.getCategory().getName())
                .typeCode(saved.getTypeCode())
                .createdDate(saved.getCreatedAt())
                .updatedDate(saved.getUpdatedAt())
                .build();
    }
}
