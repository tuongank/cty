package com.cty.toolmaster.service;

import com.cty.toolmaster.dto.CustomPage;
import com.cty.toolmaster.dto.ToolFHRegistryRequestDto;
import com.cty.toolmaster.dto.ToolFHRegistryResponse;
import com.cty.toolmaster.entity.ToolFHRegistry;
import com.cty.toolmaster.repository.ToolFHRegistryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ToolFHRegistryService {
    private final ToolFHRegistryRepository toolFHRegistryRepository;

    public Page<ToolFHRegistryResponse> getAll(int page, int rowsPerPage, String filter, String sortBy, boolean descending) {
        Sort sort = Sort.unsorted();
        if (StringUtils.hasText(sortBy)) {
            sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        }

        Pageable pageable;
        if (rowsPerPage > 0) {
            pageable = PageRequest.of(page - 1, rowsPerPage, sort);
        } else {
            pageable = Pageable.unpaged(sort);
        }

        Page<ToolFHRegistry> registryPage;
        if (StringUtils.hasText(filter)) {
            registryPage = toolFHRegistryRepository.findBySerialNumberContainingIgnoreCase(filter, pageable);
        } else {
            registryPage = toolFHRegistryRepository.findAll(pageable);
        }

        return registryPage.map(this::mapToResponse);
    }

    @Transactional
    public ToolFHRegistryResponse createToolFHRegistry(ToolFHRegistryRequestDto request) {
        if (toolFHRegistryRepository.findBySerialNumber(request.getSerialNumber()).isPresent()) {
            throw new IllegalArgumentException("Serial number already exists");
        }
        ToolFHRegistry toolFHRegistry = ToolFHRegistry.builder()
                .serialNumber(request.getSerialNumber())
                .categoryId(request.getCategoryId())
                .categoryName(request.getCategoryName())
                .typeCode(request.getTypeCode())
                .zoneLoc(request.getZoneLoc())
                .status(request.getStatus())
                .build();
        ToolFHRegistry saved = toolFHRegistryRepository.save(toolFHRegistry);
        return mapToResponse(saved);
    }

    @Transactional
    public ToolFHRegistryResponse updateToolFHRegistry(Integer id, ToolFHRegistryRequestDto request) {
        ToolFHRegistry existing = toolFHRegistryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Registry not found"));

        if (!existing.getSerialNumber().equals(request.getSerialNumber())) {
            if (toolFHRegistryRepository.findBySerialNumber(request.getSerialNumber()).isPresent()) {
                throw new IllegalArgumentException("Serial number already exists");
            }
        }

        existing.setSerialNumber(request.getSerialNumber());
        existing.setCategoryId(request.getCategoryId());
        existing.setCategoryName(request.getCategoryName());
        existing.setTypeCode(request.getTypeCode());
        existing.setZoneLoc(request.getZoneLoc());
        existing.setStatus(request.getStatus());
        ToolFHRegistry saved = toolFHRegistryRepository.save(existing);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteToolFHRegistry(Integer id) {
        if (!toolFHRegistryRepository.existsById(id)) {
            throw new IllegalArgumentException("Registry not found");
        }
        toolFHRegistryRepository.deleteById(id);
    }

    private ToolFHRegistryResponse mapToResponse(ToolFHRegistry saved) {
        return ToolFHRegistryResponse.builder()
                .id(saved.getId())
                .serialNumber(saved.getSerialNumber())
                .categoryId(saved.getCategoryId())
                .categoryName(saved.getCategoryName())
                .typeCode(saved.getTypeCode())
                .zoneLoc(saved.getZoneLoc())
                .status(saved.getStatus())
                .createdDate(saved.getCreatedAt())
                .updatedDate(saved.getUpdatedAt())
                .build();
    }
}
