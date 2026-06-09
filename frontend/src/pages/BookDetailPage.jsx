import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBook, deleteBook } from '../api/books';

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await getBook(id);
        setBook(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
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

  if (loading) {
    return <div className="page" style={{ padding: 40, textAlign: 'center', color: '#888' }}>불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="page">
        <div style={{ padding: 16, background: '#fee', color: '#c0392b', borderRadius: 4 }}>
          {error}
        </div>
        <Link to="/" className="back-btn" style={{ marginTop: 16, display: 'inline-block' }}>← 목록으로</Link>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="page">
      <div className="page-head">
        <Link to="/books" className="back-btn">← 목록으로</Link>
        <div className="btn-group">
          <button className="btn" onClick={() => navigate(`/books/${id}/edit`)}>
            수정
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            삭제
          </button>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-cover">
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.title} />
          ) : (
            <span>표지 없음<br />(생성 전)</span>
          )}
        </div>
        <div>
          {book.category && (
            <div className="category-badge category-badge-lg" data-category={book.category}>{book.category}</div>
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
    </div>
  );
}

export default BookDetailPage;
