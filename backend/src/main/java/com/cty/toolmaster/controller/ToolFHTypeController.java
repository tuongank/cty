package com.cty.toolmaster.controller;

import com.cty.toolmaster.dto.ApiResponse;
import com.cty.toolmaster.dto.ToolFHTypeRequestDto;
import com.cty.toolmaster.dto.ToolFHTypeResponse;
import com.cty.toolmaster.service.ToolFHTypeService;
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
@RequestMapping("/tool-fh-types")
public class ToolFHTypeController {

    private final ToolFHTypeService toolFHTypeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ToolFHTypeResponse>>> getAll() {
        List<ToolFHTypeResponse> responses = toolFHTypeService.getAll();
        ApiResponse<List<ToolFHTypeResponse>> apiResponse = new ApiResponse<>(responses, new String[0], "tool-fh-type-get-all-success");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ToolFHTypeResponse>> createToolFHType(@RequestBody @Valid ToolFHTypeRequestDto request) {
        ToolFHTypeResponse response = toolFHTypeService.createToolFHType(request);
        ApiResponse<ToolFHTypeResponse> apiResponse = new ApiResponse<>(response, new String[0], "tool-fh-type-create-success");
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ToolFHTypeResponse>> updateToolFHType(@PathVariable Integer id, @RequestBody @Valid ToolFHTypeRequestDto request) {
        ToolFHTypeResponse response = toolFHTypeService.updateToolFHType(id, request);
        ApiResponse<ToolFHTypeResponse> apiResponse = new ApiResponse<>(response, new String[0], "tool-fh-type-update-success");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteToolFHType(@PathVariable Integer id) {
        toolFHTypeService.deleteToolFHType(id);
        ApiResponse<Void> apiResponse = new ApiResponse<>(null, new String[0], "tool-fh-type-delete-success");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
