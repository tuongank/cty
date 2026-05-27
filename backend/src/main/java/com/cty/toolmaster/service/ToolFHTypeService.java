package com.cty.toolmaster.service;

import com.cty.toolmaster.dto.ToolFHTypeRequestDto;
import com.cty.toolmaster.dto.ToolFHTypeResponse;
import com.cty.toolmaster.entity.ToolFHType;
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
        ToolFHType toolFHType = ToolFHType.builder()
                .categoryId(request.getCategoryId())
                .categoryName(request.getCategoryName())
                .typeCode(request.getTypeCode())
                .build();
        ToolFHType saved = toolFHTypeRepository.save(toolFHType);
        return mapToResponse(saved);
    }

    @Transactional
    public ToolFHTypeResponse updateToolFHType(Integer id, ToolFHTypeRequestDto request) {
        ToolFHType existing = toolFHTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Type not found"));

        if (!existing.getTypeCode().equals(request.getTypeCode()) || !existing.getCategoryId().equals(request.getCategoryId())) {
            if (toolFHTypeRepository.findByTypeCodeAndCategoryId(request.getTypeCode(), request.getCategoryId()).isPresent()) {
                throw new IllegalArgumentException("Type already exists in this category");
            }
        }

        existing.setCategoryId(request.getCategoryId());
        existing.setCategoryName(request.getCategoryName());
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
                .categoryId(saved.getCategoryId())
                .categoryName(saved.getCategoryName())
                .typeCode(saved.getTypeCode())
                .createdDate(saved.getCreatedAt())
                .updatedDate(saved.getUpdatedAt())
                .build();
    }
}
