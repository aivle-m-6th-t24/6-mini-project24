package com.aivle.bookapp.controller;

import com.aivle.bookapp.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    // 💡 내일(2일 차) 이곳에 프론트엔드가 요청을 보낼 6개의 주소(GET, POST, PATCH, DELETE 등)를 뚫어줄 예정입니다!
}