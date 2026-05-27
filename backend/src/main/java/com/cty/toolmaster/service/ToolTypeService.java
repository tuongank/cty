package com.cty.toolmaster.service;

import com.cty.toolmaster.entity.ToolType;
import com.cty.toolmaster.repository.ToolTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ToolTypeService {
    private final ToolTypeRepository toolTypeRepository;

    public List<ToolType> getAll() {
        return toolTypeRepository.findAll();
    }

    public ToolType create(ToolType toolType) {
        return toolTypeRepository.save(toolType);
    }

    public ToolType update(Long id, ToolType toolType) {
        ToolType existing = toolTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ToolType not found"));
        existing.setCategoryId(toolType.getCategoryId());
        existing.setCategoryName(toolType.getCategoryName());
        existing.setTypeCode(toolType.getTypeCode());
        return toolTypeRepository.save(existing);
    }

    public void delete(Long id) {
        toolTypeRepository.deleteById(id);
    }
}
