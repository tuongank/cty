package com.cty.toolmaster.dto;

import jakarta.validation.constraints.NotBlank;
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
public class ToolFHCategoryRequestDto {
    @NotBlank(message = "Category cannot be empty")
    private String categoryName;
}
