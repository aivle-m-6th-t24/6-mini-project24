import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getBooks } from '../api/books';
import { getFavoriteIds, subscribeFavoritesChanged, toggleFavoriteBook } from '../api/favorites';

function MyPage() {
  const { user, isLoggedIn } = useAuth();
  const [favoriteBooks, setFavoriteBooks] = useState([]);

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

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadFavoriteBooks = async () => {
      try {
        const books = await getBooks();
        const favoriteIds = getFavoriteIds();
        setFavoriteBooks(books.filter((book) => favoriteIds.includes(String(book.id))));
      } catch {
        setFavoriteBooks([]);
      }
    };

    loadFavoriteBooks();
    return subscribeFavoritesChanged(loadFavoriteBooks);
  }, [isLoggedIn]);

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

  const handleRemoveFavorite = (bookId) => {
    toggleFavoriteBook(bookId);
    setFavoriteBooks((books) => books.filter((book) => String(book.id) !== String(bookId)));
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

      <div className="profile-box favorite-box">
        <div className="favorite-title-row">
          <h2>찜한 도서</h2>
          <span>{favoriteBooks.length}권</span>
        </div>

        {favoriteBooks.length > 0 ? (
          <div className="mypage-favorite-list">
            {favoriteBooks.map((book) => (
              <div key={book.id} className="mypage-favorite-item">
                <Link to={`/books/${book.id}`} className="mypage-favorite-link">
                  <div className="mypage-favorite-cover">
                    {book.coverImageUrl ? (
                      <img src={book.coverImageUrl} alt={book.title} />
                    ) : (
                      <span>표지 없음</span>
                    )}
                  </div>
                  <div>
                    {book.category && (
                      <span className="category-badge" data-category={book.category}>{book.category}</span>
                    )}
                    <strong>{book.title}</strong>
                    <p>{book.author} · {new Date(book.createdAt).toLocaleDateString('ko-KR')}</p>
                  </div>
                </Link>
                <button className="favorite-icon-btn active" onClick={() => handleRemoveFavorite(book.id)} title="찜 해제" aria-label="찜 해제">
                  ♥
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-favorites">
            <p>아직 찜한 도서가 없습니다.</p>
            <Link to="/books" className="btn btn-primary">찜하러 가기</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPage;
