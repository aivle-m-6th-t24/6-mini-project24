import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBook, deleteBook } from '../api/books';
import { isFavoriteBook, toggleFavoriteBook } from '../api/favorites';
import { useAuth } from '../context/AuthContext';

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [book, setBook] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await getBook(id);
        setBook(data);
        setFavorite(isFavoriteBook(data.id));
        setError('');
      } catch (err) {
        setError(err.message || '책을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  useEffect(() => {
    const savedReviews = localStorage.getItem(`reviews_${id}`);

    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews([]);
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteBook(id);
      alert('삭제되었습니다.');
      navigate('/books');
    } catch (err) {
      alert(`삭제 실패: ${err.message}`);
    }
  };

  const handleFavorite = () => {
    if (!isLoggedIn) {
      alert('로그인 후 찜할 수 있습니다.');
      navigate('/login');
      return;
    }

    setFavorite(toggleFavoriteBook(book.id));
  };

  const handleAddReview = () => {
    if (!reviewText.trim()) {
      alert('리뷰를 입력해주세요.');
      return;
    }

    const newReview = {
      id: Date.now(),
      text: reviewText,
      createdAt: new Date().toLocaleString('ko-KR'),
    };

    const updatedReviews = [newReview, ...reviews];

    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
    setReviewText('');
  };

  if (loading) {
    return (
      <div className="page" style={{ padding: 40, textAlign: 'center', color: '#888' }}>
        불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div style={{ padding: 16, background: '#fee', color: '#c0392b', borderRadius: 4 }}>
          {error}
        </div>
        <Link to="/books" className="back-btn" style={{ marginTop: 16, display: 'inline-block' }}>
          ← 목록으로
        </Link>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="page">
      <div className="page-head">
        <Link to="/books" className="back-btn">← 목록으로</Link>

        {isLoggedIn ? (
          <div className="btn-group">
            <button
              className={favorite ? 'btn btn-favorite active' : 'btn btn-favorite'}
              onClick={handleFavorite}
            >
              {favorite ? '♥ 찜 해제' : '♡ 찜하기'}
            </button>

            <button className="btn" onClick={() => navigate(`/books/${id}/edit`)}>
              수정
            </button>

            <button className="btn btn-danger" onClick={handleDelete}>
              삭제
            </button>
          </div>
        ) : (
          <button
            className="btn"
            onClick={() => navigate('/login')}
            title="로그인 후 도서를 수정/삭제할 수 있습니다."
          >
            로그인하고 관리하기
          </button>
        )}
      </div>

      <div className="detail-layout">
        <div className="detail-cover">
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.title} />
          ) : (
            <span>
              표지 없음
              <br />
              (생성 전)
            </span>
          )}
        </div>

        <div>
          {book.category && (
            <div className="category-badge category-badge-lg" data-category={book.category}>
              {book.category}
            </div>
          )}

          <h1 className="detail-title">{book.title}</h1>
          <p className="detail-author">{book.author} 著</p>

          <p className="detail-dates">
            등록 {new Date(book.createdAt).toLocaleString('ko-KR')}
            {' · '}
            수정 {new Date(book.updatedAt).toLocaleString('ko-KR')}
          </p>

          <div className="detail-content">{book.content}</div>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>📝 리뷰</h2>

        {isLoggedIn ? (
          <>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="이 책에 대한 리뷰를 작성해보세요."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '10px',
                marginBottom: '10px',
              }}
            />

            <button className="btn" onClick={handleAddReview}>
              리뷰 등록
            </button>
          </>
        ) : (
          <p>로그인 후 리뷰를 작성할 수 있습니다.</p>
        )}

        <div style={{ marginTop: '20px' }}>
          {reviews.length === 0 ? (
            <p>등록된 리뷰가 없습니다.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '10px',
                  marginBottom: '10px',
                }}
              >
                <p>{review.text}</p>
                <small>{review.createdAt}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;