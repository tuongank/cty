package com.cty.toolmaster.service;

import com.cty.toolmaster.dto.DashboardMetricsDto;
import com.cty.toolmaster.repository.ToolFHRegistryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ToolFHRegistryRepository registryRepository;

    public DashboardMetricsDto getMetrics() {
        long totalTools = registryRepository.count();
        long toolsOnline = registryRepository.countOnlineTools();
        long toolsPM = registryRepository.countPmTools();
        long toolsScrap = registryRepository.countScrapTools();
        long toolsRepair = registryRepository.countRepairTools();

        List<Object[]> categoryCounts = registryRepository.countByCategory();
        Map<String, Long> categoryDistribution = new HashMap<>();
        for (Object[] result : categoryCounts) {
            String category = (String) result[0];
            Long count = (Long) result[1];
            categoryDistribution.put(category != null ? category : "Unknown", count);
        }

        return DashboardMetricsDto.builder()
                .totalTools(totalTools)
                .toolsOnline(toolsOnline)
                .toolsPM(toolsPM)
                .toolsScrap(toolsScrap)
                .toolsRepair(toolsRepair)
                .categoryDistribution(categoryDistribution)
                .build();
    }
}
