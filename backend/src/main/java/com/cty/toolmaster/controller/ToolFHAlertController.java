package com.cty.toolmaster.controller;

import com.cty.toolmaster.entity.ToolFHAlert;
import com.cty.toolmaster.service.ToolFHAlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class ToolFHAlertController {
    private final ToolFHAlertService alertService;

    @GetMapping
    public ResponseEntity<List<ToolFHAlert>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }
}
