package com.cty.toolmaster.service;

import com.cty.toolmaster.entity.Registry;
import com.cty.toolmaster.repository.RegistryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RegistryService {
    private final RegistryRepository registryRepository;

    public Map<String, Object> getAll(int page, int rowsPerPage, String filter, String sortBy, boolean descending) {
        Sort sort = Sort.unsorted();
        if (StringUtils.hasText(sortBy)) {
            sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        }

        Pageable pageable;
        if (rowsPerPage > 0) {
            // Frontend pagination is 1-indexed, Spring Data is 0-indexed
            pageable = PageRequest.of(page - 1, rowsPerPage, sort);
        } else {
            // Fetch all if rowsPerPage is 0 (or negative)
            pageable = Pageable.unpaged(sort);
        }

        Page<Registry> registryPage;
        if (StringUtils.hasText(filter)) {
            registryPage = registryRepository.findBySerialNumberContainingIgnoreCase(filter, pageable);
        } else {
            registryPage = registryRepository.findAll(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("data", registryPage.getContent());
        response.put("total", registryPage.getTotalElements());
        return response;
    }

    public Registry create(Registry registry) {
        return registryRepository.save(registry);
    }

    public Registry update(Long id, Registry registry) {
        Registry existing = registryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registry not found"));
        existing.setSerialNumber(registry.getSerialNumber());
        existing.setCategoryId(registry.getCategoryId());
        existing.setCategoryName(registry.getCategoryName());
        existing.setTypeCode(registry.getTypeCode());
        existing.setZoneLoc(registry.getZoneLoc());
        existing.setStatus(registry.getStatus());
        return registryRepository.save(existing);
    }

    public void delete(Long id) {
        registryRepository.deleteById(id);
    }
}
