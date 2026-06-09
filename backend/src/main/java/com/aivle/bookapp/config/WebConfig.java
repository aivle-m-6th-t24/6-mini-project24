package com.aivle.bookapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 백엔드 주소에 대해서
                .allowedOrigins("http://localhost:5173", "http://localhost:3000") // 리액트 주소의 접근을 허락한다
                .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS") // 이 행동들을 허락한다
                .allowedHeaders("*");
    }
}