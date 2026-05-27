package com.cty.toolmaster;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ToolMasterApplication {

    public static void main(String[] args) {
        SpringApplication.run(ToolMasterApplication.class, args);
    }

}
