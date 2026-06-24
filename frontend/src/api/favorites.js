import { authHeaders, isLoggedIn } from './auth';
import { FAVORITES_URL } from './baseUrl';

const FAVORITES_CHANGED_EVENT = 'favorites-changed';

// 내가 찜한 책 ID 목록 (서버 조회) — 비로그인 시 빈 배열
export async function getFavoriteIds() {
  if (!isLoggedIn()) return [];
  try {
    const res = await fetch(FAVORITES_URL, { headers: authHeaders() });
    if (!res.ok) return [];
    const ids = await res.json(); // Long[]
    return ids.map(String);
  } catch {
    return [];
  }
}

// 찜 추가
export async function addFavorite(bookId) {
  await fetch(`${FAVORITES_URL}?bookId=${bookId}`, {
    method: 'POST',
    headers: authHeaders(),
  });
  notifyChanged();
}

// 찜 해제
export async function removeFavorite(bookId) {
  await fetch(`${FAVORITES_URL}?bookId=${bookId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  notifyChanged();
}

// 현재 찜 상태(isCurrentlyFavorite)에 따라 토글 → 새 상태(boolean) 반환
export async function toggleFavoriteBook(bookId, isCurrentlyFavorite) {
  if (isCurrentlyFavorite) {
    await removeFavorite(bookId);
    return false;
  }
  await addFavorite(bookId);
  return true;
}

// 찜 변경을 다른 페이지에 알림 (MyPage 실시간 반영용)
function notifyChanged() {
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
}

export function subscribeFavoritesChanged(callback) {
  const handler = () => callback();
  window.addEventListener(FAVORITES_CHANGED_EVENT, handler);
  return () => window.removeEventListener(FAVORITES_CHANGED_EVENT, handler);
}
