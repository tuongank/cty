package com.cty.toolmaster.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ToolFHTypeResponse {
    private int id;
    private Integer categoryId;
    private String categoryName;
    private String typeCode;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
