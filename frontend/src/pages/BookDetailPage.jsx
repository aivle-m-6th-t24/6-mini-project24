import React, { useState, useEffect } from 'react';
// 1. 방금 확인한 openai.js에서 함수를 불러옵니다.
import { generateBookCover } from '../api/openai';

function BookDetailPage() {
  // 기존 책 데이터 상태 (예시)
  const [book, setBook] = useState({ title: '', content: '', author: '', category: '' });

  // 2. AI 표지 생성을 위한 새로운 상태값들을 추가합니다.
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

  // 3. 표지 생성 버튼을 눌렀을 때 실행될 함수입니다.
  const handleGenerateCover = async () => {
    if (!apiKey) {
      alert("OpenAI API Key를 입력해주세요.");
      return;
    }

    try {
      setIsGenerating(true); // 로딩 상태 시작

      // openai.js의 함수 호출
      const base64Image = await generateBookCover({
        apiKey: apiKey,
        book: book,
        quality: 'LOW',   // 필요에 따라 MEDIUM 등으로 변경
        style: '3D'       // 원하는 스타일 옵션 선택
      });

      // 결과 이미지를 상태에 저장하여 화면에 보여줍니다.
      setGeneratedImageUrl(base64Image);
      alert("AI 표지가 성공적으로 생성되었습니다!");

      // TODO: (다음 단계) 생성된 base64Image를 백엔드로 보내서 DB에 저장하는 로직 추가

    } catch (error) {
      alert(error.message); // openai.js에서 던진 에러 메시지 출력
    } finally {
      setIsGenerating(false); // 로딩 상태 종료
    }
  };

  return (
      <div className="book-detail-container">
        {/* ... 기존 책 정보 표시 영역 ... */}
        <h1>{book.title}</h1>
        <p>{book.content}</p>

        {/* 4. AI 표지 생성 UI 영역 추가 */}
        <div className="ai-cover-section" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc' }}>
          <h3>🤖 AI 표지 생성기</h3>


          <input
              type="password"
              placeholder="OpenAI API Key 입력"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ marginRight: '10px' }}
          />

          <button onClick={handleGenerateCover} disabled={isGenerating}>
            {isGenerating ? '표지 생성 중... ⏳' : 'AI 표지 생성하기 ✨'}
          </button>

          {/* 생성된 이미지가 있으면 화면에 표시 */}
          {generatedImageUrl && (
              <div style={{ marginTop: '15px' }}>
                <h4>생성된 표지 미리보기:</h4>
                <img src={generatedImageUrl} alt="AI Generated Cover" style={{ width: '200px', borderRadius: '8px' }} />
              </div>
          )}
        </div>
      </div>
  );
}

export default BookDetailPage;