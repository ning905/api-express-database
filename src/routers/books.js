const express = require("express");
const router = express.Router();
const db = require("../../db");
const { addSqlCondition } = require("../functions/queryFunctions");

router.get("/", async (req, res) => {
  let per_page = 20;
  let page = 1;
  let sqlQuery = "SELECT * FROM books";
  const params = [];

  if (req.query.type) {
    params.push(req.query.type);
    sqlQuery += addSqlCondition(params, "type", sqlQuery);
  }

  if (req.query.topic) {
    params.push(req.query.topic);
    sqlQuery += addSqlCondition(params, "topic", sqlQuery);
  }

  if (req.query.author) {
    params.push(req.query.author);
    sqlQuery += addSqlCondition(params, "author", sqlQuery);
  }

  if (req.query.per_page) {
    const newPer_page = Number(req.query.per_page);
    if (newPer_page >= 10 && newPer_page <= 50) {
      per_page = newPer_page;
    }
  }
  params.push(per_page);
  sqlQuery += ` LIMIT $${params.length}`;

  if (req.query.page) {
    page = Number(req.query.page);
  }
  const pageStart = per_page * (page - 1);
  params.push(pageStart);
  sqlQuery += ` OFFSET $${params.length}`;

  //   console.log(sqlQuery);
  //   console.log(params);

  const qResult = await db.query(sqlQuery, params);

  //   console.log(qResult.rows);

  res.status(200).json({ books: qResult.rows });
});

router.post("/", async (req, res) => {
  const newBook = req.body;
  const params = [
    newBook.title,
    newBook.type,
    newBook.author,
    newBook.topic,
    newBook.publicationDate,
    newBook.pages,
  ];
  //   console.log(params);

  const sqlQuery =
    'INSERT INTO books (title, "type", author, topic, publicationDate, pages) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
  //   console.log(sqlQuery);

  const qResult = await db.query(sqlQuery, params);
  //   console.log(qResult.rows[0].id);

  res.status(201).json({ book: { id: qResult.rows[0].id, ...newBook } });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const params = [id];

  const sqlQuery = "SELECT * FROM books WHERE id = $1;";
  //   console.log(sqlQuery);
  const qResult = await db.query(sqlQuery, params);
  //   console.log(qResult.rows[0]);

  const thisBook = {
    id: qResult.rows[0].id,
    title: qResult.rows[0].title,
    author: qResult.rows[0].author,
    topic: qResult.rows[0].topic,
    publicationDate: qResult.rows[0].publicationdate,
    pages: qResult.rows[0].pages,
    // ...qResult.rows[0],
  };
  //   console.log(thisBook);

  res.status(200).json({ book: thisBook });
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const newInfo = { id: id, ...req.body };
  const params = [
    id,
    newInfo.title,
    newInfo.type,
    newInfo.author,
    newInfo.topic,
    newInfo.publicationDate,
    newInfo.pages,
  ];

  const sqlQuery =
    'UPDATE books SET title = $2, "type" = $3, author = $4, topic = $5, publicationdate = $6, pages = $7 WHERE id = $1;';
  await db.query(sqlQuery, params);

  res.status(201).json({ book: newInfo });
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const params = [id];

  const sqlQuery = "DELETE FROM books WHERE id = $1 RETURNING *;";
  const qResult = await db.query(sqlQuery, params);
  //   console.log(qResult.rows[0]);

  const thisBook = {
    id: qResult.rows[0].id,
    title: qResult.rows[0].title,
    author: qResult.rows[0].author,
    topic: qResult.rows[0].topic,
    publicationDate: qResult.rows[0].publicationdate,
    pages: qResult.rows[0].pages,
  };
  //   console.log(thisBook);

  res.status(201).json({ book: thisBook });
});

module.exports = router;
