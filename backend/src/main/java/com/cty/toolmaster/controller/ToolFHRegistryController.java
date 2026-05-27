package com.cty.toolmaster.controller;

import com.cty.toolmaster.dto.ApiResponse;
import com.cty.toolmaster.dto.CustomPage;
import com.cty.toolmaster.dto.ToolFHRegistryRequestDto;
import com.cty.toolmaster.dto.ToolFHRegistryResponse;
import com.cty.toolmaster.service.ExcelService;
import com.cty.toolmaster.service.ToolFHRegistryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@Validated
@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/tool-fh-registries")
public class ToolFHRegistryController {

    private final ToolFHRegistryService toolFHRegistryService;
    private final ExcelService excelService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ToolFHRegistryResponse>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int rowsPerPage,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "false") boolean descending) {
        
        Page<ToolFHRegistryResponse> pageResult = toolFHRegistryService.getAll(page, rowsPerPage, filter, sortBy, descending);
        
        CustomPage customPage = CustomPage.builder()
                .currentPage(pageResult.getNumber() + 1)
                .rowsPerPage(pageResult.getSize())
                .totalRows(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .sortBy(sortBy != null ? sortBy : "")
                .direction(descending ? "DESC" : "ASC")
                .build();

        ApiResponse<List<ToolFHRegistryResponse>> apiResponse = new ApiResponse<>(
                pageResult.getContent(), 
                customPage, 
                new String[0], 
                "tool-fh-registry-get-all-success"
        );
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ToolFHRegistryResponse>> createToolFHRegistry(@RequestBody @Valid ToolFHRegistryRequestDto request) {
        ToolFHRegistryResponse response = toolFHRegistryService.createToolFHRegistry(request);
        ApiResponse<ToolFHRegistryResponse> apiResponse = new ApiResponse<>(response, new String[0], "tool-fh-registry-create-success");
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ToolFHRegistryResponse>> updateToolFHRegistry(@PathVariable Integer id, @RequestBody @Valid ToolFHRegistryRequestDto request) {
        ToolFHRegistryResponse response = toolFHRegistryService.updateToolFHRegistry(id, request);
        ApiResponse<ToolFHRegistryResponse> apiResponse = new ApiResponse<>(response, new String[0], "tool-fh-registry-update-success");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteToolFHRegistry(@PathVariable Integer id) {
        toolFHRegistryService.deleteToolFHRegistry(id);
        ApiResponse<Void> apiResponse = new ApiResponse<>(null, new String[0], "tool-fh-registry-delete-success");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PostMapping("/upload/excel")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadExcel(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = excelService.uploadExcel(file);
        ApiResponse<Map<String, Object>> apiResponse = new ApiResponse<>(result, new String[0], "tool-fh-registry-upload-success");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
