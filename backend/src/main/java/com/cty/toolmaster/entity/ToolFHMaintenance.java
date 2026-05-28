package com.cty.toolmaster.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@Table(name = "ToolFHMaintenance")
public class ToolFHMaintenance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registry_id", nullable = false)
    private ToolFHRegistry registry;

    @Column(name = "maintenance_type", nullable = false)
    private String maintenanceType; // Validation, PM, Repair

    @Column(name = "scheduled_date")
    private LocalDateTime scheduledDate;

    @Column(name = "completed_date")
    private LocalDateTime completedDate;

    @Column(name = "status", nullable = false)
    private String status; // Pending, Completed, Confirmed

    @Column(name = "description")
    private String description;

    @Column(name = "cycle")
    private String cycle; // 500000 Shots, 2000 Hours

    @Column(name = "usage_at_maintenance")
    private Long usageAtMaintenance;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
