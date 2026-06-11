import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, getUsername, login as apiLogin, logout as apiLogout, signup as apiSignup } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { username } 또는 null

  // 페이지 새로고침 시 localStorage에서 로그인 상태 복원
  useEffect(() => {
    if (getToken()) {
      setUser({ username: getUsername() });
    }
  }, []);

  const login = async (username, password) => {
    const data = await apiLogin(username, password);
    setUser({ username: data.username });
    return data;
  };

  const signup = async (username, password) => {
    return await apiSignup(username, password);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.');
  return ctx;
}
