package com.cty.toolmaster.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ToolFHRegistryRequestDto {
    @NotBlank(message = "Serial number cannot be empty")
    private String serialNumber;
    
    @NotNull(message = "Category ID cannot be null")
    private Integer categoryId;
    
    @NotNull(message = "Type ID cannot be null")
    private Integer typeId;
    
    @NotBlank(message = "Location cannot be empty")
    private String location;
    
    @NotBlank(message = "Status cannot be empty")
    private String status;
}
