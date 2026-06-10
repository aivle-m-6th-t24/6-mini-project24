# 도서관리시스템 백엔드 (AI 미니프로젝트 5차)

> 4차에서 개발한 React 프론트엔드(`../frontend`)의 json-server를 Spring Boot + JPA + H2로 대체하고,
> AI 표지 저장 API까지 확장한다.

---

## 1일차 산출물 (미션 1·2)

### 미션 1 — 기획/설계

#### Frontend 호출 패턴 분석
`../frontend/src/api/books.js` 에서 추출:

| 함수 | 메서드 | URL | 본문 |
|---|---|---|---|
| `getBooks` | GET | `/books` | - |
| `getBook(id)` | GET | `/books/:id` | - |
| `createBook(book)` | POST | `/books` | `{title, author, content, category, coverImageUrl, createdAt, updatedAt}` |
| `updateBook(id, patch)` | PATCH | `/books/:id` | 변경 필드 + `updatedAt` |
| `deleteBook(id)` | DELETE | `/books/:id` | - |

추가로 `../frontend/src/api/openai.js` 에서 AI 표지 생성 결과는 `coverImageUrl`로 PATCH 저장됨.

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
| 3 | POST | `/books` | 등록 | 200 | 400 |
| 4 | PATCH | `/books/{id}` | 부분 수정 | 200 | 400, 404 |
| 5 | DELETE | `/books/{id}` | 삭제 | 200 | 404 |
| 6 | PATCH | `/books/{id}/cover` | AI 표지 저장 (4일차) | 200 | 400, 404 |

---

### 미션 2 — 환경설정 + 모든 계층 골격 작성

#### 기술 스택
- Java 17 / Spring Boot 4.0.6
- Spring Web (MVC), Spring Data JPA, Validation, Lombok, DevTools
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
        ├── application.yaml
        └── data.sql                       # 시드 5권
```

#### CORS 정책 (`WebConfig.java`)
- 허용 Origin: `http://localhost:5173` (Vite), `http://localhost:3000` (json-server 잔재)
- 허용 메서드: `GET, POST, PATCH, DELETE, OPTIONS`

---

## 2일차 산출물 (미션 3·4)

### 미션 3 — Repository + Service + GET 2종 + Frontend 1차 연동

#### [Repository] `BookRepository.java`
`JpaRepository<Book, Long>` 인터페이스만 상속받아 한 줄로 정의. Spring Data JPA가 `findAll`, `findById`, `save`, `deleteById` 등 기본 CRUD 메서드를 자동 제공.

```java
public interface BookRepository extends JpaRepository<Book, Long> {
}
```

**H2 콘솔 동작 검증**: `http://localhost:8080/h2-console` 접속 → JDBC URL `jdbc:h2:mem:testdb`, User `sa` (비번 없음) → `SELECT * FROM books;` 로 시드 5권 확인.

#### [Service] `BookService` — 조회 2종
- 생성자 주입: `@RequiredArgsConstructor` + `private final BookRepository`
- `findAllBooks()`: 전체 도서 목록
- `findBookById(Long id)`: 단일 도서 상세 (없으면 `IllegalArgumentException` → 3일차에 사용자 정의 예외로 교체)

```java
@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public List<Book> findAllBooks() {
        return bookRepository.findAll();
    }

    public Book findBookById(Long id) {
        return bookRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("해당 ID의 도서가 없습니다: " + id));
    }
}
```

#### [Controller] `BookController` — GET 2종
- `GET /books` → 목록 조회
- `GET /books/{id}` → 상세 조회

```java
@GetMapping
public List<Book> getBooks() {
    return bookService.findAllBooks();
}

@GetMapping("/{id}")
public Book getBook(@PathVariable Long id) {
    return bookService.findBookById(id);
}
```

#### [통합] Frontend 1차 연동
`../frontend/src/api/books.js` 의 `BASE_URL` 한 줄 변경:
```js
const BASE_URL = 'http://localhost:8080/books'; // 기존: 3000 (json-server)
```

**Postman 테스트 시나리오**:
| Method | URL | 기대 결과 |
|---|---|---|
| GET | `/books` | 200 OK + 시드 5권 JSON |
| GET | `/books/1` | 200 OK + 1번 도서 |
| GET | `/books/999` | 500 (3일차에 404로 정제 예정) |

---

### 미션 4 — POST / PATCH / DELETE + 검증

#### [Domain] Book Entity 입력 검증 어노테이션
`title`과 `author`에 `@NotBlank` + `@Size` 적용. Controller의 `@Valid`와 함께 작동.
```java
@NotBlank(message = "제목은 필수입니다.")
@Size(max = 200, message = "제목은 200자 이하여야 합니다.")
@Column(nullable = false)
private String title;

@NotBlank(message = "저자는 필수입니다.")
@Size(max = 100, message = "저자명은 100자 이하여야 합니다.")
@Column(nullable = false)
private String author;
```
> `@Column(nullable = false)`는 DB 레벨 제약, `@NotBlank`/`@Size`는 요청 본문 검증. 둘은 별개라 같이 두는 게 일반적.

#### [Service] 등록 / 부분 수정 / 삭제 메서드
```java
// 3. 신규 도서 등록
public Book createBook(Book book) {
    return bookRepository.save(book);
}

// 4. 도서 정보 수정 (부분 수정 - PATCH)
public Book updateBook(Long id, Book patchBook) {
    Book existingBook = findBookById(id);
    if (patchBook.getTitle() != null) existingBook.setTitle(patchBook.getTitle());
    if (patchBook.getAuthor() != null) existingBook.setAuthor(patchBook.getAuthor());
    if (patchBook.getContent() != null) existingBook.setContent(patchBook.getContent());
    if (patchBook.getCategory() != null) existingBook.setCategory(patchBook.getCategory());
    return bookRepository.save(existingBook);
}

// 5. 도서 삭제
public void deleteBook(Long id) {
    bookRepository.deleteById(id);
}
```

**PATCH 부분 수정의 핵심**: 요청 본문에서 받은 `patchBook` 중 `null이 아닌 필드만` 기존 객체에 반영. 따라서 Frontend가 `{title: "수정"}`만 보내도 author/content는 기존 값 유지.

#### [Controller] POST + 검증 / PATCH / DELETE
```java
// 3. 신규 도서 등록 (POST)
@PostMapping
public Book createBook(@Valid @RequestBody Book book) {
    return bookService.createBook(book);
}

// 4. 도서 정보 수정 (PATCH)
@PatchMapping("/{id}")
public Book updateBook(@PathVariable Long id, @RequestBody Book patchBook) {
    return bookService.updateBook(id, patchBook);
}

// 5. 도서 삭제 (DELETE)
@DeleteMapping("/{id}")
public void deleteBook(@PathVariable Long id) {
    bookService.deleteBook(id);
}
```
- POST에 `@Valid` 적용 → Entity의 검증 어노테이션이 작동하면 400 Bad Request 자동 응답
- PATCH는 `@PatchMapping` 사용 (`@PutMapping`이 아님 — Frontend가 PATCH로 호출)

#### [통합] 풀스택 CRUD 동작 확인

**Postman 테스트 시나리오**:
| Method | URL | Body 예시 | 기대 결과 |
|---|---|---|---|
| POST | `/books` | `{title:"새 책", author:"홍길동"}` | 200 OK + id 자동 부여 |
| POST | `/books` | `{}` (title 누락) | 400 Bad Request (`@NotBlank` 작동) |
| PATCH | `/books/1` | `{title:"수정"}` | 200 OK + title만 갱신 |
| DELETE | `/books/1` | - | 200 OK |

**React 화면 동작**:
- 메인 → 도서 목록 → 카드 클릭 → 상세 페이지 (GET)
- `+ 신규 등록` → 폼 입력 → 저장 (POST)
- 상세 → `수정` → 폼 수정 → 저장 (PATCH)
- 상세 → `삭제` → 확인 → 목록에서 제거 (DELETE)

#### 한글 인코딩 이슈 해결
H2 콘솔과 `data.sql` 시드 데이터의 한글이 깨지는 문제 발생 → `application.yaml`에 인코딩 명시:
```yaml
spring:
  sql:
    init:
      mode: always
      encoding: UTF-8       # Windows에서 한글 깨짐 방지
```

---

## 팀 R&R (예시)

| 역할 | 담당 |
|---|---|
| PM | 편진솔 |
| Backend | 이제혁 |
| Backend | 이소은 |
| 통합예외처리 | 유정환 |
| Frontend 연동 / AI | 김주형 |

---

## 실행 방법

### 백엔드
```bash
cd backend
gradlew bootRun          # Windows
./gradlew bootRun        # Mac/Linux
# http://localhost:8080/books
# http://localhost:8080/h2-console  (JDBC URL: jdbc:h2:mem:testdb)
```

### 프론트엔드
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

---

## 일정

| 일차 | 미션 | 핵심 | 상태 |
|---|---|---|---|
| 1일차 | M1·M2 | 설계 + 골격 + WebConfig + Git | ✅ |
| 2일차 | M3·M4 | CRUD 5종 + Frontend 1차 연동 | ✅ |
| 3일차 | M5·M6 | 사용자 정의 예외 + `@Transactional` + `@RestControllerAdvice` | ⏳ |
| 4일차 | M7·M8 | AI 표지 저장 API + 최종 마무리 + 발표 | ⏳ |
