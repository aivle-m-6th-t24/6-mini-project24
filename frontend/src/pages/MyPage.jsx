import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function MyPage() {
  const { user, isLoggedIn } = useAuth();

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    genre: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem(`profile_${user.username}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    }
  }, [user]);

  if (!isLoggedIn) {
    return (
      <div className="mypage-card">
        <h1>👤 마이페이지</h1>
        <p>로그인이 필요합니다.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSave = () => {
    localStorage.setItem(`profile_${user.username}`, JSON.stringify(profile));
    setIsEditing(false);
    alert('회원 정보가 저장되었습니다.');
  };

  return (
    <div className="mypage-card">
      <h1>👤 마이페이지</h1>

      <div className="profile-box">
        <h2>내 정보</h2>

        <div className="profile-item">
          <span className="profile-label">아이디</span>
          <span className="profile-value">{user.username}</span>
        </div>

        {isEditing ? (
          <>
            <div className="profile-item">
              <span className="profile-label">이름</span>
              <input className="profile-input" name="name" value={profile.name} onChange={handleChange} />
            </div>

            <div className="profile-item">
              <span className="profile-label">전화번호</span>
              <input className="profile-input" name="phone" value={profile.phone} onChange={handleChange} />
            </div>

            <div className="profile-item">
              <span className="profile-label">이메일</span>
              <input className="profile-input" name="email" value={profile.email} onChange={handleChange} />
            </div>

            <div className="profile-item">
              <span className="profile-label">선호 장르</span>
              <input className="profile-input" name="genre" value={profile.genre} onChange={handleChange} />
            </div>

            <div className="mypage-buttons">
              <button className="edit-btn" onClick={handleSave}>저장</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>취소</button>
            </div>
          </>
        ) : (
          <>
            <div className="profile-item">
              <span className="profile-label">이름</span>
              <span className="profile-value">{profile.name || '미입력'}</span>
            </div>

            <div className="profile-item">
              <span className="profile-label">전화번호</span>
              <span className="profile-value">{profile.phone || '미입력'}</span>
            </div>

            <div className="profile-item">
              <span className="profile-label">이메일</span>
              <span className="profile-value">{profile.email || '미입력'}</span>
            </div>

            <div className="profile-item">
              <span className="profile-label">선호 장르</span>
              <span className="profile-value">{profile.genre || '미입력'}</span>
            </div>

            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              회원 정보 수정
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default MyPage;