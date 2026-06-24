package com.aivle.bookapp.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "favorites",
    uniqueConstraints = @UniqueConstraint(columnNames = {"username", "bookId"}) // 같은 책 중복 찜 방지
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String username; // 찜한 사용자

    @Column(nullable = false)
    private Long bookId; // 찜한 책
}
