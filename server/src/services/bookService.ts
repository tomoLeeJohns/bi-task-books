import db from "../models/db.js";
import { Book, GetBooksParams } from "../types/index.js";

const getBooks = async (queryParams: GetBooksParams) => {
  const { title, isbn, cursor, prevCursor, limit } = queryParams;
  let sql = `SELECT * FROM books WHERE 1=1`;
  let params = [];

  if (title) {
    sql += ` AND title LIKE ?`;
    params.push(`%${title}%`);
  }

  if (isbn) {
    sql += ` AND isbn LIKE ?`;
    params.push(`%${isbn}%`);
  }

  if (cursor) {
    sql += ` AND id > ?`;
    params.push(cursor);
  }

  if (prevCursor) {
    sql += ` AND id < ?`;
    params.push(prevCursor);
  }

  sql += ` ORDER BY id ASC LIMIT ?`;
  params.push(Number(limit));

  const [rows] = await db.query(sql, params);
  return rows as Book[];
};

const addBook = async (book: Omit<Book, "id">) => {
  const { title, author, isbn, numberOfPages, rating } = book;
  const query =
    "INSERT INTO books (title, author, isbn, numberOfPages, rating) VALUES (?, ?, ?, ?, ?)";
  await db.query(query, [title, author, isbn, numberOfPages, rating]);
};

const isIsbnUnique = async (isbn: string) => {
  const [rows] = await db.query("SELECT id FROM books WHERE isbn = ?", [isbn]);
  return (rows as { id: number }[]).length === 0;
};

const bookService = { getBooks, addBook, isIsbnUnique };
export default bookService;
