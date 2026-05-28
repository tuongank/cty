package com.cty.toolmaster.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DashboardMetricsDto {
    private long totalTools;
    private long toolsOnline;
    private long toolsPM;
    private long toolsScrap;
    private long toolsRepair;
    private Map<String, Long> categoryDistribution;
}
