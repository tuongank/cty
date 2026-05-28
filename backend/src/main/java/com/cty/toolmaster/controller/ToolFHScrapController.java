package com.cty.toolmaster.controller;

import com.cty.toolmaster.entity.ToolFHScrap;
import com.cty.toolmaster.service.ToolFHScrapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/scraps")
@RequiredArgsConstructor
public class ToolFHScrapController {
    private final ToolFHScrapService scrapService;

    @GetMapping
    public ResponseEntity<List<ToolFHScrap>> getAllScraps() {
        return ResponseEntity.ok(scrapService.getAllScraps());
    }
}
