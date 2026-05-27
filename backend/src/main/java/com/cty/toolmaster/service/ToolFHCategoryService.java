package com.cty.toolmaster.service;

import com.cty.toolmaster.dto.ToolFHCategoryRequestDto;
import com.cty.toolmaster.dto.ToolFHCategoryResponse;
import com.cty.toolmaster.entity.ToolFHCategory;
import com.cty.toolmaster.repository.ToolFHCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ToolFHCategoryService {
    private final ToolFHCategoryRepository toolFHCategoryRepository;

    public List<ToolFHCategoryResponse> getAll() {
        return toolFHCategoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ToolFHCategoryResponse createToolFHCategory(ToolFHCategoryRequestDto request) {
        if (toolFHCategoryRepository.findToolFHCategoryByName(request.getCategoryName()).isPresent()) {
            throw new IllegalArgumentException("Category already exists");
        }
        ToolFHCategory toolFHCategory = ToolFHCategory.builder()
                .name(request.getCategoryName())
                .build();
        ToolFHCategory saved = toolFHCategoryRepository.save(toolFHCategory);
        return mapToResponse(saved);
    }

    @Transactional
    public ToolFHCategoryResponse updateToolFHCategory(Integer id, ToolFHCategoryRequestDto request) {
        ToolFHCategory existing = toolFHCategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        
        if (!existing.getName().equals(request.getCategoryName()) && 
            toolFHCategoryRepository.findToolFHCategoryByName(request.getCategoryName()).isPresent()) {
            throw new IllegalArgumentException("Category already exists");
        }

        existing.setName(request.getCategoryName());
        ToolFHCategory saved = toolFHCategoryRepository.save(existing);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteToolFHCategory(Integer id) {
        if (!toolFHCategoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Category not found");
        }
        toolFHCategoryRepository.deleteById(id);
    }

    private ToolFHCategoryResponse mapToResponse(ToolFHCategory saved) {
        return ToolFHCategoryResponse.builder()
                .id(saved.getId())
                .category(saved.getName())
                .createdDate(saved.getCreatedAt())
                .updatedDate(saved.getUpdatedAt())
                .build();
    }
}
