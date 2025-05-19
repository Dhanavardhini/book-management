const apiUrl = 'http://localhost:5000/books';

async function loadBooks() {
  try {
    const res = await fetch(apiUrl);
    const books = await res.json();

    const list = document.getElementById('bookList');
    list.innerHTML = '';

    books.forEach(book => {
      const li = document.createElement('li');
      li.innerText = `${book.title} by ${book.author}`;

      // Delete button
      const delBtn = document.createElement('button');
      delBtn.innerText = 'Delete';
      delBtn.onclick = async () => {
        await fetch(`${apiUrl}/${book._id}`, { method: 'DELETE' });
        loadBooks();
      };

      li.appendChild(delBtn);
      list.appendChild(li);
    });
  } catch (error) {
    console.error('Failed to load books:', error);
  }
}

document.getElementById('bookForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();

  if (!title || !author) return;

  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author }),
    });

    document.getElementById('title').value = '';
    document.getElementById('author').value = '';

    loadBooks();
  } catch (error) {
    console.error('Failed to add book:', error);
  }
});

// Initial load
loadBooks();
