import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { generateBookCover } from '../api/openai';
import { getBook, updateCover, deleteBook } from '../api/books';

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await getBook(id);
        setBook(data);
        setError('');
      } catch (err) {
        setError(err.message || '책을 불러오는 중 오류가 발생했습니다.');
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

  const handleGenerateCover = async () => {
    if (!apiKey) {
      alert('OpenAI API Key를 입력해주세요.');
      return;
    }
    if (!book) {
      alert('먼저 도서 정보를 불러와야 합니다.');
      return;
    }

    try {
      setIsGenerating(true);

      const base64Image = await generateBookCover({
        apiKey,
        book,
        quality: 'LOW',
        style: '3D',
      });

      setGeneratedImageUrl(base64Image);

      // 백엔드에 표지 저장 (PATCH /books/{id}/cover)
      const updated = await updateCover(book.id, base64Image);
      setBook(updated);

      alert('AI 표지가 성공적으로 생성되어 저장되었습니다!');
    } catch (err) {
      alert(err.message || '표지 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
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
        <Link to="/books" className="back-btn" style={{ marginTop: 16, display: 'inline-block' }}>← 목록으로</Link>
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
          ) : generatedImageUrl ? (
            <img src={generatedImageUrl} alt={`생성된 표지 - ${book.title}`} />
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

      {/* AI 표지 생성 섹션 */}
      <section className="ai-cover-section">
        <h3 className="ai-cover-title">🤖 AI 표지 생성기</h3>
        <div className="ai-cover-controls">
          <input
            type="password"
            className="ai-cover-key"
            placeholder="OpenAI API Key 입력"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button className="btn btn-ai" onClick={handleGenerateCover} disabled={isGenerating}>
            {isGenerating ? '표지 생성 중...' : 'AI 표지 생성하기'}
          </button>
        </div>
        {generatedImageUrl && (
          <div className="ai-cover-preview">
            <h4>생성된 표지 미리보기</h4>
            <img src={generatedImageUrl} alt="AI Generated Cover" />
          </div>
        )}
      </section>
    </div>
  );
}

export default BookDetailPage;
