# 도서관리시스템 — AI 표지 자동 생성

> KT AIVLE School AI 트랙 · 미니프로젝트 5차
> "걷기가 서재 — 작가의 산책" · AI가 책 표지를 자동 생성하는 도서 관리 시스템

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.6-green)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![Java](https://img.shields.io/badge/Java-17-orange)](https://openjdk.org)

---

## 📖 프로젝트 소개

- 사용자가 도서를 등록 · 조회 · 수정 · 삭제할 수 있는 웹 애플리케이션
- 도서 제목과 내용을 바탕으로 **OpenAI Image API**가 표지 이미지를 자동 생성
- 4차 미니프로젝트에서 만든 React 프론트엔드의 `json-server`를 Spring Boot + JPA + H2로 대체

## 🛠 기술 스택

| 영역 | 기술 |
|---|---|
| **Frontend** | React 19, Vite, Fetch API |
| **Backend** | Spring Boot 4.0.6, Spring MVC, Spring Data JPA, Lombok, Validation |
| **Database** | H2 (in-memory) |
| **AI** | OpenAI Images API (GPT Image 모델) |
| **Build** | Gradle Wrapper |
| **협업** | GitHub |

## 📂 폴더 구조

```
4차/
├── backend/         # Spring Boot 백엔드 (5차 신규)
│   ├── README.md    # 백엔드 상세 문서
│   ├── API.md       # API 정의서 (6개 엔드포인트)
│   └── src/main/java/com/aivle/bookapp/
│       ├── domain/Book.java
│       ├── repository/BookRepository.java
│       ├── service/BookService.java
│       ├── controller/BookController.java
│       └── config/WebConfig.java
└── frontend/        # React 프론트엔드 (4차 통합)
    └── src/
        ├── pages/   # BookList, BookDetail, BookCreate, BookEdit, Home
        ├── api/     # books.js, openai.js
        └── components/Header.jsx
```

## 🚀 실행 방법

### 백엔드 (터미널 1)
```bash
cd backend
./gradlew bootRun          # Mac/Linux
gradlew.bat bootRun        # Windows
# → http://localhost:8080
# → H2 콘솔: http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:testdb)
```

### 프론트엔드 (터미널 2)
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## 📑 상세 문서

| 문서 | 내용 |
|---|---|
| [backend/README.md](backend/README.md) | 백엔드 ERD, R&R, 1일차 산출물 |
| [backend/API.md](backend/API.md) | 6개 엔드포인트 상세 API 정의서 |

## 📅 일정 (4일)

| 일차 | 미션 | 핵심 작업 | 상태 |
|---|---|---|---|
| **1일차** | M1·M2 | 설계 (ERD/API) + Spring Boot 골격 + WebConfig | ✅ 완료 |
| 2일차 | M3·M4 | CRUD 5종 구현 + Frontend 1차 연동 | ⏳ |
| 3일차 | M5·M6 | 사용자 정의 예외 + `@Transactional` + `@RestControllerAdvice` | ⏳ |
| 4일차 | M7·M8 | AI 표지 저장 API + 최종 마무리 + 발표 | ⏳ |

## 👥 팀 R&R

| 역할 | 담당 |
|---|---|
| PM / 문서 | (TBD) |
| Backend - 도메인 / Repository | (TBD) |
| Backend - Service / 예외 | (TBD) |
| Backend - Controller | (TBD) |
| Frontend 연동 / AI | (TBD) |
