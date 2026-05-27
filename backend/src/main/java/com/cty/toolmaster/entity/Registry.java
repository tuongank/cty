package com.cty.toolmaster.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "registries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Registry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String serialNumber;
    
    private String categoryId;
    
    private String categoryName;
    
    private String typeCode;
    
    private String zoneLoc;
    
    private String status;
}
