const express = require("express");
const router = express.Router();
const {
  booksColumns,
  getAllBooks,
  getBookByTitle,
  addNewBook,
  getBookById,
  updateBook,
  deleteBook,
} = require("../domain/booksRepo");
const { errorMessage } = require("../domain/string");

router.get("/", async (req, res) => {
  const allBooks = await getAllBooks(req.query);
  // console.log(allBooks.length);

  res.status(200).json({ books: allBooks });
});

router.post("/", async (req, res) => {
  // Check if all fields are valid
  const props = Object.keys(req.body);
  if (props.length < booksColumns.length - 1) {
    return res.status(400).json({ error: errorMessage.missingField });
  }

  // Sending error response if the book already exists
  const foundByTitle = await getBookByTitle(req.body.title);
  if (foundByTitle.rowCount) {
    return res.json({ error: errorMessage.bookTitleExists });
  }

  // Add the new book to the database
  const newBook = await addNewBook(req.body);
  res.status(201).json({ book: { id: newBook.id, ...req.body } });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  //check if the book exists
  const foundById = await getBookById(id);
  if (!foundById.rowCount) {
    return res.status(404).json({ error: errorMessage.bookIdNotFound });
  }

  const thisBook = {
    id: found.rows[0].id,
    title: found.rows[0].title,
    author: found.rows[0].author,
    topic: found.rows[0].topic,
    publicationDate: found.rows[0].publicationdate,
    pages: found.rows[0].pages,
    // ...found.rows[0],
  };
  //   console.log(thisBook);

  res.status(200).json({ book: thisBook });
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);

  // Check if the book with the provided id exists
  const foundById = await getBookById(id);
  if (!foundById.rowCount) {
    return res.status(404).json({ error: errorMessage.bookIdNotFound });
  }

  // Check if a book with the provided title exists
  const foundByTitle = await getBookByTitle(req.body.title);
  if (foundByTitle.rowCount) {
    return res.status(409).json({ error: errorMessage.bookTitleExists });
  }

  // Update in the database
  const updated = await updateBook(id, req.body);
  res.status(201).json({ book: updated.rows[0] });
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  // Check if the book with the provided id exists
  const foundById = await getBookById(id);
  if (!foundById.rowCount) {
    return res.status(404).json({ error: errorMessage.bookIdNotFound });
  }

  const result = await deleteBook(id);
  const thisBook = {
    id: id,
    title: result.rows[0].title,
    author: result.rows[0].author,
    topic: result.rows[0].topic,
    publicationDate: result.rows[0].publicationdate,
    pages: result.rows[0].pages,
  };
  res.status(201).json({ book: thisBook });
});

module.exports = router;
