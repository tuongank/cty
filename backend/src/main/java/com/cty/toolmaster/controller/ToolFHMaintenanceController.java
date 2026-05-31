package com.cty.toolmaster.controller;

import com.cty.toolmaster.entity.ToolFHMaintenance;
import com.cty.toolmaster.service.ToolFHMaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class ToolFHMaintenanceController {
    private final ToolFHMaintenanceService maintenanceService;

    @GetMapping
    public ResponseEntity<List<ToolFHMaintenance>> getAllMaintenance() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenance());
    }
}
