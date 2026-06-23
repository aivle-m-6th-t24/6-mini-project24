package com.aivle.bookapp.config;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

/**
 * React(SPA) 정적 파일 서빙 + 새로고침/직접접근 시 index.html fallback.
 * - React 빌드 산출물(dist)은 빌드 시 classpath:/static/ 에 복사된다.
 * - 실제 정적 파일(js/css/이미지)은 그대로 서빙.
 * - /api/**, /h2-console/** 는 백엔드가 처리하므로 fallback 제외.
 * - 그 외 경로(/books, /login 등 SPA 라우트)는 index.html 반환 → React Router가 처리.
 */
@Configuration
public class SpaWebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(@NonNull String resourcePath, @NonNull Resource location)
                            throws IOException {
                        Resource requested = location.createRelative(resourcePath);
                        if (requested.exists() && requested.isReadable()) {
                            return requested; // 실제 정적 파일 (assets/*.js, *.css, 이미지 등)
                        }
                        // API / H2 콘솔은 SPA fallback 대상이 아님
                        if (resourcePath.startsWith("api/") || resourcePath.startsWith("h2-console")) {
                            return null;
                        }
                        // 그 외 SPA 라우트는 index.html 반환 (React Router가 클라이언트에서 라우팅)
                        return new ClassPathResource("/static/index.html");
                    }
                });
    }
}
