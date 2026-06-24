package com.aivle.bookapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aivle.bookapp.domain.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // 특정 책의 리뷰를 최신순으로 조회
    List<Review> findByBookIdOrderByCreatedAtDesc(Long bookId);
}
