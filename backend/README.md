# 도서관리시스템 백엔드 (AI 미니프로젝트 5차)

> 4차에서 개발한 React 프론트엔드(`../my-app`)의 json-server를 Spring Boot + JPA + H2로 대체하고,
> AI 표지 저장 API까지 확장한다.

---

## 1일차 산출물 (미션 1·2)

### 미션 1 — 기획/설계

#### Frontend 호출 패턴 분석
`../my-app/src/api/books.js` 에서 추출:

| 함수 | 메서드 | URL | 본문 |
|---|---|---|---|
| `getBooks` | GET | `/books` | - |
| `getBook(id)` | GET | `/books/:id` | - |
| `createBook(book)` | POST | `/books` | `{title, author, content, category, coverImageUrl, createdAt, updatedAt}` |
| `updateBook(id, patch)` | PATCH | `/books/:id` | 변경 필드 + `updatedAt` |
| `deleteBook(id)` | DELETE | `/books/:id` | - |

추가로 `../my-app/src/api/openai.js` 에서 AI 표지 생성 결과는 `coverImageUrl`로 PATCH 저장됨.

#### ERD — Book 엔티티

```
┌─────────────────────────────────────────────┐
│                   books                     │
├─────────────────────────────────────────────┤
│ id              BIGINT PK AUTO_INCREMENT    │
│ title           VARCHAR(200) NOT NULL       │
│ author          VARCHAR(100) NOT NULL       │
│ category        VARCHAR(50)                 │
│ content         TEXT                        │
│ cover_image_url TEXT                        │
│ created_at      DATETIME NOT NULL           │
│ updated_at      DATETIME NOT NULL           │
└─────────────────────────────────────────────┘
```

#### API 정의서

요약표는 아래와 같다. 엔드포인트별 상세 요청/응답/에러 케이스는 **[API.md](API.md)** 참고.

| # | 메서드 | URL | 설명 | 성공 | 에러 |
|---|---|---|---|---|---|
| 1 | GET | `/books` | 목록 조회 | 200 | - |
| 2 | GET | `/books/{id}` | 상세 조회 | 200 | 404 |
| 3 | POST | `/books` | 등록 | 201 | 400 |
| 4 | PATCH | `/books/{id}` | 부분 수정 | 200 | 400, 404 |
| 5 | DELETE | `/books/{id}` | 삭제 | 204 | 404 |
| 6 | PATCH | `/books/{id}/cover` | AI 표지 저장 (4일차) | 200 | 400, 404 |

---

### 미션 2 — 환경설정 + 모든 계층 골격 작성

#### 기술 스택
- Java 17 / Spring Boot 3.5.0
- Spring Web, Spring Data JPA, Validation, Lombok
- H2 (in-memory)
- Gradle Wrapper

#### 폴더 구조
```
backend/
├── build.gradle
├── settings.gradle
├── gradlew, gradlew.bat
├── gradle/wrapper/
└── src/main/
    ├── java/com/aivle/bookapp/
    │   ├── BookappApplication.java
    │   ├── config/WebConfig.java          # CORS
    │   ├── controller/BookController.java # REST API
    │   ├── service/BookService.java       # 비즈니스 로직
    │   ├── repository/BookRepository.java # JpaRepository
    │   └── domain/Book.java               # Entity
    └── resources/
        ├── application.yml
        └── data.sql                       # 시드 5권
```

#### CORS 정책 (`WebConfig.java`)
- 허용 Origin: `http://localhost:5173` (Vite), `http://localhost:3000` (json-server 잔재)
- 허용 메서드: `GET, POST, PUT, PATCH, DELETE, OPTIONS`

---

## 팀 R&R (예시)

| 역할 | 담당 |
|---|---|
| PM / 문서 | (조원 1) |
| Backend - 도메인 / Repository | (조원 2) |
| Backend - Service / 예외 | (조원 3) |
| Backend - Controller | (조원 4) |
| Frontend 연동 / AI | (조원 5) |

---

## 실행 방법

### 백엔드
```bash
cd backend
./gradlew bootRun        # Linux/Mac
gradlew.bat bootRun      # Windows
# http://localhost:8080/books
# http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:bookdb)
```

### 프론트엔드 (4차와 동일)
```bash
cd my-app
npm install
npm run dev
# http://localhost:5173
```

> 2일차부터 `my-app/src/api/books.js` 의 `BASE_URL`을 `http://localhost:8080/books`로 변경하면 연동된다.

---

## 일정

| 일차 | 미션 | 핵심 |
|---|---|---|
| 1일차 (오늘) | M1·M2 | 설계 + 골격 + WebConfig + Git |
| 2일차 | M3·M4 | CRUD 5종 + Frontend 1차 연동 |
| 3일차 | M5·M6 | 사용자 정의 예외 + `@Transactional` + `@RestControllerAdvice` |
| 4일차 | M7·M8 | AI 표지 저장 API + 최종 마무리 + 발표 |
