const AUTH_URL = 'http://localhost:8080/auth';
const TOKEN_KEY = 'auth_token';
const USERNAME_KEY = 'auth_username';

// 토큰 저장/조회/제거 (localStorage)
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}

function saveAuth(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

// 회원가입
export async function signup(username, password) {
  try {
    const res = await fetch(`${AUTH_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `회원가입 실패 (${res.status})`);
    }
    return await res.json();
  } catch (err) {
    console.error('[signup]', err);
    throw err;
  }
}

// 로그인 — 성공 시 토큰을 localStorage에 저장
export async function login(username, password) {
  try {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `로그인 실패 (${res.status})`);
    }
    const data = await res.json(); // { token, username }
    saveAuth(data.token, data.username);
    return data;
  } catch (err) {
    console.error('[login]', err);
    throw err;
  }
}

// 로그아웃 — 백엔드 토큰 무효화 + 로컬 정리
export async function logout() {
  const token = getToken();
  try {
    if (token) {
      await fetch(`${AUTH_URL}/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (err) {
    console.warn('[logout] 백엔드 호출 실패 (무시):', err);
  } finally {
    clearAuth();
  }
}

// 모든 fetch에 자동으로 Authorization 헤더 추가
export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
