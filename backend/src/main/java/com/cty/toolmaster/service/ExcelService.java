package com.cty.toolmaster.service;

import com.cty.toolmaster.entity.ToolFHRegistry;
import com.cty.toolmaster.repository.ToolFHRegistryRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExcelService {
    private final ToolFHRegistryRepository toolFHRegistryRepository;

    public Map<String, Object> uploadExcel(MultipartFile file) {
        List<ToolFHRegistry> registries = new ArrayList<>();
        Map<String, Object> result = new HashMap<>();
        
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            
            // Assuming row 0 is header
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                String serialNumber = getCellValue(row.getCell(0));
                if (serialNumber == null || serialNumber.trim().isEmpty()) {
                    continue; // Skip empty rows
                }
                
                String categoryName = getCellValue(row.getCell(1));
                String typeCode = getCellValue(row.getCell(2));
                String zoneLoc = getCellValue(row.getCell(3));
                String status = getCellValue(row.getCell(4));
                
                Integer categoryId = "HEAD".equalsIgnoreCase(categoryName) ? 2 : 1; // Temporary mapping based on integer IDs
                if (status == null || status.trim().isEmpty()) {
                    status = "ACTIVE";
                }
                
                ToolFHRegistry registry = ToolFHRegistry.builder()
                        .serialNumber(serialNumber.trim())
                        .categoryName(categoryName != null ? categoryName.trim().toUpperCase() : "")
                        .categoryId(categoryId)
                        .typeCode(typeCode != null ? typeCode.trim().toUpperCase() : "")
                        .zoneLoc(zoneLoc != null ? zoneLoc.trim() : "")
                        .status(status.trim().toUpperCase())
                        .build();
                        
                registries.add(registry);
            }
            
            // Bulk save
            toolFHRegistryRepository.saveAll(registries);
            
            result.put("imported", registries.size());
            result.put("message", "Excel data uploaded successfully");
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
        }
        
        return result;
    }
    
    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue());
            default:
                return "";
        }
    }
}
