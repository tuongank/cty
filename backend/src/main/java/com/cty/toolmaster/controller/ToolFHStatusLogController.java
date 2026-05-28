package com.cty.toolmaster.controller;

import com.cty.toolmaster.entity.ToolFHStatusLog;
import com.cty.toolmaster.service.ToolFHStatusLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/status-logs")
@RequiredArgsConstructor
public class ToolFHStatusLogController {
    private final ToolFHStatusLogService statusLogService;

    @GetMapping
    public ResponseEntity<List<ToolFHStatusLog>> getAllLogs() {
        return ResponseEntity.ok(statusLogService.getAllLogs());
    }
}
