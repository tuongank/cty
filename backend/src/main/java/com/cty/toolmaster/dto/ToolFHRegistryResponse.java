package com.cty.toolmaster.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ToolFHRegistryResponse {
    private int id;
    private String serialNumber;
    private Integer categoryId;
    private String categoryName;
    private String typeCode;
    private String zoneLoc;
    private String status;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
