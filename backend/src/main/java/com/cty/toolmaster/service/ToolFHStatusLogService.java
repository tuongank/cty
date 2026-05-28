package com.cty.toolmaster.service;

import com.cty.toolmaster.entity.ToolFHStatusLog;
import com.cty.toolmaster.repository.ToolFHStatusLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ToolFHStatusLogService {
    private final ToolFHStatusLogRepository repository;

    public List<ToolFHStatusLog> getAllLogs() {
        return repository.findAll();
    }
}
