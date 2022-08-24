const db = require("../../db");
const { buildWhereClause, buildUpdateClause } = require("./utils");

const booksColumns = [
  "id",
  "title",
  "type",
  "author",
  "topic",
  "publicationdate",
  "pages",
];

async function getAllBooks(queryParams) {
  let page = 1;
  let per_page = 20;

  // Remove "page" and "per_page" props so they don't build in the WHERE clause
  if (queryParams.hasOwnProperty("page")) {
    page = queryParams.page;
    delete queryParams.page;
  }

  if (queryParams.hasOwnProperty("per_page")) {
    if (queryParams.per_page <= 50 && queryParams.per_page >= 10) {
      per_page = queryParams.per_page;
    }
    delete queryParams.per_page;
  }
  const pageStart = per_page * (page - 1);

  //
  const baseSql = "SELECT * FROM books";
  const queryKeys = Object.keys(queryParams);
  //   console.log("Keys: ", queryKeys);
  const sqlQuery =
    buildWhereClause(baseSql, queryKeys) +
    ` LIMIT $${queryKeys.length + 1}` +
    ` OFFSET $${queryKeys.length + 2}`;
  //   console.log(sqlQuery);
  const queryValues = Object.values(queryParams);
  //   console.log("Values: ", queryValues);

  const allBooks = await db.query(sqlQuery, [
    ...queryValues,
    per_page,
    pageStart,
  ]);

  return allBooks.rows;
}

async function getBookByTitle(title) {
  return await db.query("SELECT * FROM books WHERE title = $1", [title]);
}

async function getBookById(id) {
  return await db.query("SELECT * FROM books WHERE id = $1;", [id]);
}

async function addNewBook(newBook) {
  const requiredColumns = booksColumns.slice(1).join(", ");

  const sqlQuery = `INSERT INTO books (${requiredColumns}) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
  //   console.log(sqlQuery);

  const qResult = await db.query(sqlQuery, Object.values(newBook));
  //   console.log(qResult.rows[0].id);

  return qResult.rows[0];
}

async function updateBook(id, newInfo) {
  const columnsToUpdate = Object.keys(newInfo);
  const sqlQuery =
    buildUpdateClause("books", columnsToUpdate) +
    ` WHERE id = $${columnsToUpdate.length + 1} RETURNING *;`;

  return await db.query(sqlQuery, [...Object.values(newInfo), id]);
}

async function deleteBook(id) {
  return await db.query("DELETE FROM books WHERE id = $1 RETURNING *;", [id]);
}

// const requiredColumns = booksColumns.slice(1).join(", ");
// console.log(requiredColumns);

module.exports = {
  booksColumns,
  getAllBooks,
  getBookByTitle,
  getBookById,
  addNewBook,
  updateBook,
  deleteBook,
};
