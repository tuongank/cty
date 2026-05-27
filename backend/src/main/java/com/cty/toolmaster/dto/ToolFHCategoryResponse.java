package com.cty.toolmaster.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ToolFHCategoryResponse {
    private int id;
    private String category;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
