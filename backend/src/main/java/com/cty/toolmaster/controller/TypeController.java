package com.cty.toolmaster.controller;

import com.cty.toolmaster.entity.ToolType;
import com.cty.toolmaster.service.ToolTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/types")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TypeController {
    
    private final ToolTypeService toolTypeService;

    @GetMapping
    public List<ToolType> getAll() {
        return toolTypeService.getAll();
    }

    @PostMapping
    public ToolType create(@RequestBody ToolType toolType) {
        return toolTypeService.create(toolType);
    }

    @PutMapping("/{id}")
    public ToolType update(@PathVariable Long id, @RequestBody ToolType toolType) {
        return toolTypeService.update(id, toolType);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        toolTypeService.delete(id);
    }
}
