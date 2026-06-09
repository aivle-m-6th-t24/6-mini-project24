package com.aivle.bookapp.service;

import com.aivle.bookapp.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    // 💡 내일(2일 차) 이곳에 도서를 찾고, 저장하고, 지우는 핵심 로직들을 채워 넣을 예정입니다!
}