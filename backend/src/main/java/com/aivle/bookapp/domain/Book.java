package com.aivle.bookapp.domain;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 도서 고유 번호 (자동 생성)

    @Column(nullable = false)
    private String title; // 도서 제목 (필수)

    @Column(nullable = false)
    private String author; // 저자명 (필수)

    @Column(columnDefinition = "TEXT")
    private String content; // 도서 상세 내용

    private String category = "소설"; // 기본값 세팅

    @Column(columnDefinition = "TEXT")
    private String coverImageUrl; // AI 표지 이미지 주소 (base64 Data URL)

    // 4차 프론트엔드(books.js)가 등록일/수정일을 표시하므로 추가
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
