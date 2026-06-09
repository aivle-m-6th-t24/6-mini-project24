import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage'; // 홈 화면 임포트 추가
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import BookCreatePage from './pages/BookCreatePage';
import BookEditPage from './pages/BookEditPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="container">
        <Routes>
          {/* 기본 경로는 홈 화면으로, 도서 목록은 /books로 분리 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BookListPage />} />
          <Route path="/books/new" element={<BookCreatePage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/books/:id/edit" element={<BookEditPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;