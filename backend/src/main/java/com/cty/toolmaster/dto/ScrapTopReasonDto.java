package com.cty.toolmaster.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ScrapTopReasonDto {
    private String reason;
    private Long count;
}
