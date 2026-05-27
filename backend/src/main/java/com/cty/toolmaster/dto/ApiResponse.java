package com.cty.toolmaster.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Links;
import org.springframework.hateoas.RepresentationModel;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class ApiResponse<T> extends RepresentationModel<ApiResponse<T>> {
    private T data;
    private String[] errors = new String[0];
    private String contextId = "";
    private Map<String, Object> meta = new HashMap<>();

    @JsonIgnore
    private CustomPage pageInfo;

    public ApiResponse(String[] errors, String contextId){
        this.data = null;
        this.errors = errors;
        this.contextId = contextId;
    }

    public ApiResponse(String errorMsg, String contextId){
        this.data = null;
        String[] errors = new String[1];
        errors[0]  = errorMsg;
        this.errors = errors;
        this.contextId = contextId;
    }

    public ApiResponse(Throwable cause, String contextId){
        this.data = null;
        String[] errors = new String[1];
        errors[0]  = cause.getMessage();
        this.errors = errors;
        this.contextId = contextId;
    }

    public ApiResponse(T data, String[] errors, String contextId){
        this.data = data;
        this.errors = errors;
        this.contextId = contextId;
    }

    public ApiResponse(T data, CustomPage pageInfo, String[] errors, String contextId){
        this.data = data;
        this.errors = errors;
        this.contextId = contextId;
        this.meta =  new HashMap<>();
        this.meta.put("_page", pageInfo);
        this.pageInfo = pageInfo;
    }

    public ApiResponse(T data, String[] errors, String contextId, Map<String, Object> meta){
        this.data = data;
        this.errors = errors;
        this.contextId = contextId;
        this.meta =  meta;
    }

    public void addLinks(Links links){
        Map<String, Link> linksMap = new HashMap<>();
        links.forEach(link -> linksMap.put(link.getRel().value(), link));
        meta.put("_links", linksMap);
    }
}
