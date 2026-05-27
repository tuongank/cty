package com.cty.toolmaster.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ToolFHRegistryRequestDto {
    private String serialNumber;
    private String categoryName;
    private String typeName;
    private String location;
    private String status;
}
