package com.cty.toolmaster.service;

import com.cty.toolmaster.entity.ToolFHAlert;
import com.cty.toolmaster.repository.ToolFHAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ToolFHAlertService {
    private final ToolFHAlertRepository repository;

    public List<ToolFHAlert> getAllAlerts() {
        return repository.findAll();
    }
}
