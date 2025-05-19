const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Replace <username>, <password>, <cluster-url>, <dbname> with your MongoDB details
mongoimport --uri="your_mongodb_uri" --collection=books --file=books.json --jsonArray


const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

let collection; // MongoDB collection reference

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    const db = client.db('demo1'); // your DB name here
    collection = db.collection('demo'); // collection name
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
}
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Book API!');
});

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await collection.find({}).toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get book by id
app.get('/books/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const book = await collection.findOne({ _id: new ObjectId(id) });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Add a new book
// app.post('/books', async (req, res) => {
//   try {
//     const book = req.body;
//     const result = await collection.insertOne(book);
//     res.status(201).json(result);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to add book' });
//   }
// });
// Add a new book with validation
app.post('/books', async (req, res) => {
  try {
    const { title, author } = req.body;

    // Basic validation: check if title and author exist and are strings with length > 0
    if (
      !title || typeof title !== 'string' || title.trim().length === 0 ||
      !author || typeof author !== 'string' || author.trim().length === 0
    ) {
      return res.status(400).json({ error: 'Title and Author are required and must be non-empty strings.' });
    }

    // If validation passes, insert the book
    const result = await collection.insertOne({ title: title.trim(), author: author.trim() });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// Update book by id
app.put('/books/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Delete book by id
app.delete('/books/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
