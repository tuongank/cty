package com.cty.toolmaster.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@Table(name = "ToolFHScrap")
public class ToolFHScrap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registry_id", nullable = false, unique = true)
    private ToolFHRegistry registry;

    @Column(name = "reason", nullable = false)
    private String reason;

    @Column(name = "remark")
    private String remark;

    @CreatedDate
    @Column(name = "scrap_date", updatable = false)
    private LocalDateTime scrapDate;

    @Column(name = "created_by")
    private String createdBy;
}
