package com.cty.toolmaster.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomPage {
    private long size;
    private long totalElements;
    private long totalPages;
    private long number;
}
