package com.aivle.bookapp.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aivle.bookapp.domain.Review;
import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.exception.AuthException;
import com.aivle.bookapp.repository.ReviewRepository;
import com.aivle.bookapp.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final AuthService authService;

    // 특정 책의 리뷰 목록 (로그인 없이도 조회 가능 — 공유)
    @GetMapping
    public List<Review> getReviews(@RequestParam Long bookId) {
        return reviewRepository.findByBookIdOrderByCreatedAtDesc(bookId);
    }

    // 리뷰 작성 (로그인 필요 — 토큰에서 작성자 추출)
    @PostMapping
    public Review addReview(
            @RequestParam Long bookId,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        User user = requireUser(authHeader);

        String text = body.get("text");
        if (text == null || text.isBlank()) {
            throw new AuthException("리뷰 내용을 입력해주세요.");
        }

        Review review = new Review();
        review.setBookId(bookId);
        review.setUsername(user.getUsername());
        review.setText(text);
        return reviewRepository.save(review);
    }

    // 토큰으로 작성자 검증 (AuthController와 동일 패턴)
    private User requireUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AuthException("로그인이 필요합니다.");
        }
        return authService.findByToken(authHeader.substring(7));
    }
}
