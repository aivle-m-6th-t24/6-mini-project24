import { authHeaders } from './auth';
import { REVIEWS_URL } from './baseUrl';

// 특정 책의 리뷰 목록 (로그인 없이도 조회)
export async function getReviews(bookId) {
  const res = await fetch(`${REVIEWS_URL}?bookId=${bookId}`);
  if (!res.ok) throw new Error(`리뷰를 불러오지 못했습니다. (${res.status})`);
  return await res.json();
}

// 리뷰 작성 (로그인 필요 — 토큰 자동 첨부)
export async function addReview(bookId, text) {
  const res = await fetch(`${REVIEWS_URL}?bookId=${bookId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ text }),
  });
  if (res.status === 401) throw new Error('로그인이 필요합니다.');
  if (!res.ok) throw new Error(`리뷰 작성에 실패했습니다. (${res.status})`);
  return await res.json();
}
