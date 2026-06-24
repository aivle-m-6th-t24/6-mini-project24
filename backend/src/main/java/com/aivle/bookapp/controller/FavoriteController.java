package com.aivle.bookapp.controller;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aivle.bookapp.domain.Favorite;
import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.exception.AuthException;
import com.aivle.bookapp.repository.FavoriteRepository;
import com.aivle.bookapp.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final AuthService authService;

    // 내가 찜한 책 ID 목록 (로그인 필요)
    @GetMapping
    public List<Long> getMyFavorites(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        User user = requireUser(authHeader);
        return favoriteRepository.findByUsername(user.getUsername())
                .stream().map(Favorite::getBookId).toList();
    }

    // 찜 추가
    @PostMapping
    public void addFavorite(
            @RequestParam Long bookId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        User user = requireUser(authHeader);
        if (!favoriteRepository.existsByUsernameAndBookId(user.getUsername(), bookId)) {
            Favorite favorite = new Favorite();
            favorite.setUsername(user.getUsername());
            favorite.setBookId(bookId);
            favoriteRepository.save(favorite);
        }
    }

    // 찜 해제
    @DeleteMapping
    @Transactional
    public void removeFavorite(
            @RequestParam Long bookId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        User user = requireUser(authHeader);
        favoriteRepository.deleteByUsernameAndBookId(user.getUsername(), bookId);
    }

    private User requireUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AuthException("로그인이 필요합니다.");
        }
        return authService.findByToken(authHeader.substring(7));
    }
}
