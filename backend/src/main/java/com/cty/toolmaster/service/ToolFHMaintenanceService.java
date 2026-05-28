package com.cty.toolmaster.service;

import com.cty.toolmaster.entity.ToolFHMaintenance;
import com.cty.toolmaster.repository.ToolFHMaintenanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ToolFHMaintenanceService {
    private final ToolFHMaintenanceRepository repository;

    public List<ToolFHMaintenance> getAllMaintenance() {
        return repository.findAll();
    }
}
