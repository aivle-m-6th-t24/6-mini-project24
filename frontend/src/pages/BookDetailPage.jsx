import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBook, deleteBook } from '../api/books';
import { getFavoriteIds, toggleFavoriteBook } from '../api/favorites';
import { getReviews, addReview, updateReview, deleteReview } from '../api/reviews';
import { useAuth } from '../context/AuthContext';

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const [book, setBook] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await getBook(id);
        setBook(data);

        const favIds = await getFavoriteIds();
        setFavorite(favIds.includes(String(data.id)));

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
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const data = await getReviews(id);
      setReviews(data);
    } catch (err) {
      setReviews([]);
    }
  };

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

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      alert('로그인 후 찜할 수 있습니다.');
      navigate('/login');
      return;
    }

    const next = await toggleFavoriteBook(book.id, favorite);
    setFavorite(next);
  };

  const handleAddReview = async () => {
    if (!reviewText.trim()) {
      alert('리뷰를 입력해주세요.');
      return;
    }

    try {
      await addReview(id, reviewText);
      await fetchReviews();
      setReviewText('');
    } catch (err) {
      alert(err.message || '리뷰 작성에 실패했습니다.');
    }
  };

  const handleStartEdit = (review) => {
    setEditingReviewId(review.id);
    setEditingText(review.text);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditingText('');
  };

  const handleUpdateReview = async (reviewId) => {
    if (!editingText.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      await updateReview(reviewId, editingText);
      await fetchReviews();
      setEditingReviewId(null);
      setEditingText('');
    } catch (err) {
      alert(err.message || '리뷰 수정에 실패했습니다.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('리뷰를 삭제하시겠습니까?')) return;

    try {
      await deleteReview(reviewId);
      await fetchReviews();
    } catch (err) {
      alert(err.message || '리뷰 삭제에 실패했습니다.');
    }
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

      <div style={{ marginTop: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>📝 리뷰</h2>

        {isLoggedIn ? (
          <div
            style={{
              padding: '20px',
              border: '1px solid #eee',
              borderRadius: '16px',
              background: '#fafafa',
              marginBottom: '24px',
            }}
          >
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="이 책에 대한 리뷰를 작성해보세요."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid #ddd',
                marginBottom: '12px',
                resize: 'vertical',
                fontSize: '15px',
                boxSizing: 'border-box',
              }}
            />

            <button className="btn" onClick={handleAddReview}>
              리뷰 등록
            </button>
          </div>
        ) : (
          <p style={{ color: '#777' }}>로그인 후 리뷰를 작성할 수 있습니다.</p>
        )}

        <div style={{ marginTop: '20px' }}>
          {reviews.length === 0 ? (
            <p style={{ color: '#888' }}>등록된 리뷰가 없습니다.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: '16px',
                  padding: '18px',
                  marginBottom: '14px',
                  background: '#fff',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                }}
              >
                {editingReviewId === review.id ? (
                  <>
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid #ddd',
                        marginBottom: '10px',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                    />

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn" onClick={() => handleUpdateReview(review.id)}>
                        저장
                      </button>
                      <button className="btn" onClick={handleCancelEdit}>
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '12px' }}>
                      {review.text}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <small style={{ color: '#777' }}>
                        {review.username || '익명'} ·{' '}
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleString('ko-KR')
                          : '작성일 없음'}
                      </small>

                      {isLoggedIn && user?.username === review.username && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn" onClick={() => handleStartEdit(review)}>
                            수정
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;