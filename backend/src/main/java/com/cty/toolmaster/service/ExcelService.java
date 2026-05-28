package com.cty.toolmaster.service;

import com.cty.toolmaster.entity.ToolFHCategory;
import com.cty.toolmaster.entity.ToolFHRegistry;
import com.cty.toolmaster.entity.ToolFHType;
import com.cty.toolmaster.repository.ToolFHCategoryRepository;
import com.cty.toolmaster.repository.ToolFHRegistryRepository;
import com.cty.toolmaster.repository.ToolFHTypeRepository;
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
    private final ToolFHCategoryRepository categoryRepository;
    private final ToolFHTypeRepository typeRepository;

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
                String location = getCellValue(row.getCell(3));
                String status = getCellValue(row.getCell(4));
                
                ToolFHCategory category = categoryRepository.findToolFHCategoryByName(categoryName != null ? categoryName.trim().toUpperCase() : "")
                        .orElse(null); // Or create it if needed, but assuming it exists

                if (category == null) {
                    continue; // skip if category invalid
                }

                ToolFHType type = typeRepository.findByTypeCodeAndCategory_Name(typeCode != null ? typeCode.trim().toUpperCase() : "", category.getName())
                        .orElse(null);
                
                if (type == null) {
                    continue; // skip if type invalid
                }

                if (status == null || status.trim().isEmpty()) {
                    status = "ACTIVE";
                }
                
                ToolFHRegistry registry = ToolFHRegistry.builder()
                        .serialNumber(serialNumber.trim())
                        .category(category)
                        .type(type)
                        .location(location != null ? location.trim() : "")
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

    public byte[] generateTemplate() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Registry");
            Row headerRow = sheet.createRow(0);
            
            String[] headers = {"Serial Number", "Category", "Type", "Location", "Status"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
                
                sheet.setColumnWidth(i, 5000);
            }

            // Add a sample row
            Row sampleRow = sheet.createRow(1);
            sampleRow.createCell(0).setCellValue("T-001-DEMO");
            sampleRow.createCell(1).setCellValue("FEEDER");
            sampleRow.createCell(2).setCellValue("08 mm");
            sampleRow.createCell(3).setCellValue("Zone A > Bin 01");
            sampleRow.createCell(4).setCellValue("ACTIVE");

            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel template: " + e.getMessage());
        }
    }
}
