const BASE_URL = 'http://localhost:8080/books';

export async function getBooks() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`도서 목록을 불러오지 못했습니다. (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error('[getBooks]', err);
    throw err;
  }
}

export async function getBook(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error(`도서를 불러오지 못했습니다. (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error('[getBook]', err);
    throw err;
  }
}

export async function createBook(book) {
  try {
    const now = new Date().toISOString();
    const payload = {
      ...book,
      coverImageUrl: book.coverImageUrl ?? '',
      createdAt: now,
      updatedAt: now,
    };
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`도서 등록에 실패했습니다. (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error('[createBook]', err);
    throw err;
  }
}

export async function updateBook(id, patch) {
  try {
    const payload = {
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`도서 수정에 실패했습니다. (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error('[updateBook]', err);
    throw err;
  }
}

export async function deleteBook(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`도서 삭제에 실패했습니다. (${res.status})`);
    return true;
  } catch (err) {
    console.error('[deleteBook]', err);
    throw err;
  }
}
