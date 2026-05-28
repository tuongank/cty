package com.cty.toolmaster.controller;

import com.cty.toolmaster.dto.ApiResponse;
import com.cty.toolmaster.dto.ToolFHCategoryRequestDto;
import com.cty.toolmaster.dto.ToolFHCategoryResponse;
import com.cty.toolmaster.service.ToolFHCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/tool-feeder")
public class ToolFHCategoryController {
    
    private final ToolFHCategoryService toolFHCategoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ToolFHCategoryResponse>>> getAll() {
        List<ToolFHCategoryResponse> responses = toolFHCategoryService.getAll();
        ApiResponse<List<ToolFHCategoryResponse>> apiResponse = new ApiResponse<>(responses, new String[0], "tool-fh-category-get-all-success");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ToolFHCategoryResponse>> createToolFHCategory(@RequestBody @Valid ToolFHCategoryRequestDto request) {
        ToolFHCategoryResponse toolFHCategoryResponse = toolFHCategoryService.createToolFHCategory(request);
        ApiResponse<ToolFHCategoryResponse> apiResponse = new ApiResponse<>(toolFHCategoryResponse, new String[0], "tool-fh-category-create-success");
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ToolFHCategoryResponse>> updateToolFHCategory(@PathVariable Integer id, @RequestBody @Valid ToolFHCategoryRequestDto request) {
        ToolFHCategoryResponse toolFHCategoryResponse = toolFHCategoryService.updateToolFHCategory(id, request);
        ApiResponse<ToolFHCategoryResponse> apiResponse = new ApiResponse<>(toolFHCategoryResponse, new String[0], "tool-fh-category-update-success");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteToolFHCategory(@PathVariable Integer id) {
        toolFHCategoryService.deleteToolFHCategory(id);
        ApiResponse<Void> apiResponse = new ApiResponse<>(null, new String[0], "tool-fh-category-delete-success");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
