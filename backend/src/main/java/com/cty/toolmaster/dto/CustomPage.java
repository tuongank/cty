package com.cty.toolmaster.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomPage {
    @Builder.Default
    private int currentPage = 1;
    @Builder.Default
    private int rowsPerPage = 10;
    @Builder.Default
    private int totalPages = 1;
    @Builder.Default
    private Long totalRows = 0L;
    @Builder.Default
    private String sortBy = "";
    @Builder.Default
    private String direction = "ASC";

    public int getLastPage(){
        if(this.totalPages != 0){
            return this.totalPages;
        }
        else{
            return 1;
        }
    }

    public boolean isFirst(){
        return this.currentPage == 1 || this.totalPages == 0;
    }

    public boolean isLast(){
        return this.currentPage == this.totalPages || this.totalPages == 0;
    }

    public boolean hasNext(){
        // 1. current page == total page -> Last Page. (No next)
        // 2. total page = 1 -> Last Page (No next)
        return this.totalPages > 1 && this.currentPage != this.totalPages;
    }

    public boolean hasPrevious(){
        // 1. current page == 1 -> First page (No previous)
        // 2. total page == 1 -> First & Last page (No previous)
        return this.totalPages > 1 && this.currentPage != 1;
    }
}
