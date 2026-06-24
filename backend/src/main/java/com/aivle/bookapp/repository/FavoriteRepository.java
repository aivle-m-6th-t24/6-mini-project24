package com.aivle.bookapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aivle.bookapp.domain.Favorite;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUsername(String username);

    boolean existsByUsernameAndBookId(String username, Long bookId);

    void deleteByUsernameAndBookId(String username, Long bookId);
}
