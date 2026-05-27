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
public class ToolFHTypeRequestDto {
    @NotNull(message = "Category ID cannot be null")
    private Integer categoryId;
    
    @NotBlank(message = "Category name cannot be empty")
    private String categoryName;
    
    @NotBlank(message = "Type code cannot be empty")
    private String typeCode;
}
