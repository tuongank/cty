package com.cty.toolmaster.controller;

import com.cty.toolmaster.entity.Registry;
import com.cty.toolmaster.service.ExcelService;
import com.cty.toolmaster.service.RegistryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/registries")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RegistryController {
    
    private final RegistryService registryService;
    private final ExcelService excelService;

    @GetMapping
    public Map<String, Object> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int rowsPerPage,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "false") boolean descending) {
        return registryService.getAll(page, rowsPerPage, filter, sortBy, descending);
    }

    @PostMapping
    public Registry create(@RequestBody Registry registry) {
        return registryService.create(registry);
    }

    @PutMapping("/{id}")
    public Registry update(@PathVariable Long id, @RequestBody Registry registry) {
        return registryService.update(id, registry);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        registryService.delete(id);
    }
    
    @PostMapping("/upload/excel")
    public Map<String, Object> uploadExcel(@RequestParam("file") MultipartFile file) {
        return excelService.uploadExcel(file);
    }
}
