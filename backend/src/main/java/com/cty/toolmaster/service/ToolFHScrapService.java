package com.cty.toolmaster.service;

import com.cty.toolmaster.entity.ToolFHScrap;
import com.cty.toolmaster.repository.ToolFHScrapRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ToolFHScrapService {
    private final ToolFHScrapRepository repository;

    public List<ToolFHScrap> getAllScraps() {
        return repository.findAll();
    }
}
