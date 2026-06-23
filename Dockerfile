# syntax=docker/dockerfile:1
# 도서관리 시스템 — React(프론트) + Spring Boot(백엔드)를 단일 이미지로 빌드
# 멀티스테이지: ① React 빌드 → ② Spring 빌드(React를 static에 포함) → ③ 실행

# ── 1단계: React(Vite) 빌드 ──────────────────────────────
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build
# 결과: /app/frontend/dist

# ── 2단계: Spring Boot(Gradle) 빌드 ──────────────────────
FROM eclipse-temurin:17-jdk AS backend
WORKDIR /app/backend
COPY backend/ ./
# React 빌드 산출물을 Spring 정적 리소스로 복사 → JAR 하나에 통합
COPY --from=frontend /app/frontend/dist/ ./src/main/resources/static/
# 테스트는 Hibernate Dialect 이슈로 임시 제외 (TODO: application.yaml 수정 후 제거)
RUN chmod +x gradlew && ./gradlew bootJar -x test --no-daemon
# 결과: /app/backend/build/libs/*.jar

# ── 3단계: 실행 이미지 (가벼운 JRE) ──────────────────────
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend /app/backend/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
