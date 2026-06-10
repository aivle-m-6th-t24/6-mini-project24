-- 멱등(idempotent) 시드 — 이미 같은 title이 있으면 INSERT 안 함
-- file mode에서 재시작 시에도 중복 누적 방지

INSERT INTO books (title, author, category, content, cover_image_url, created_at, updated_at)
SELECT '달러구트 꿈 백화점', '이미예', '소설', '꿈을 사고파는 백화점에서 펼쳐지는 따뜻한 판타지 이야기. 잠들기 전 우리가 마주하는 꿈의 비밀을 들려준다.', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = '달러구트 꿈 백화점');

INSERT INTO books (title, author, category, content, cover_image_url, created_at, updated_at)
SELECT '아몬드', '손원평', '소설', '감정을 느끼지 못하는 소년 윤재가 세상과 부딪히며 사랑과 우정을 배워가는 성장 소설.', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = '아몬드');

INSERT INTO books (title, author, category, content, cover_image_url, created_at, updated_at)
SELECT '나는 나로 살기로 했다', '김수현', '에세이', '타인의 시선과 기대에서 벗어나 진짜 나로 살아가는 법을 담은 위로와 응원의 에세이.', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = '나는 나로 살기로 했다');

INSERT INTO books (title, author, category, content, cover_image_url, created_at, updated_at)
SELECT '미움받을 용기', '기시미 이치로, 고가 후미타케', '자기계발', '아들러 심리학을 바탕으로 자유롭게 사는 법을 철학자와 청년의 대화 형식으로 풀어낸 베스트셀러.', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = '미움받을 용기');

INSERT INTO books (title, author, category, content, cover_image_url, created_at, updated_at)
SELECT '사피엔스', '유발 하라리', '인문', '호모 사피엔스가 어떻게 지구의 지배종이 되었는지 인지·농업·과학 혁명으로 추적한 거대 인류사.', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = '사피엔스');

INSERT INTO books (title, author, category, content, cover_image_url, created_at, updated_at)
SELECT '부의 추월차선', '엠제이 드마코', '경제경영', '평범한 부의 공식에서 벗어나 빠르게 경제적 자유에 도달하는 사고법과 시스템을 제시한 책.', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = '부의 추월차선');

INSERT INTO books (title, author, category, content, cover_image_url, created_at, updated_at)
SELECT '코스모스', '칼 세이건', '과학', '광활한 우주와 그 안에 놓인 인간의 자리를 시적인 문체로 풀어낸 과학 교양의 명저.', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = '코스모스');

INSERT INTO books (title, author, category, content, cover_image_url, created_at, updated_at)
SELECT '총, 균, 쇠', '재레드 다이아몬드', '역사', '지난 1만 3천 년 동안 인류 문명이 왜 대륙별로 다르게 발전했는지 지리·생태·기술 관점에서 분석한 역작.', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = '총, 균, 쇠');
