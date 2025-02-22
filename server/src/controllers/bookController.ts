import bookService from "../services/bookService.js";
import { Request, Response } from "express";
import { Book, GetBooksParams } from "../types/index.js";

const getBooks = async (
  req: Request<{}, {}, {}, GetBooksParams>,
  res: Response
) => {
  try {
    const params = req.query;
    const rows = await bookService.getBooks(params);
    const searchParamsEmpty = !params?.title?.length && !params?.author?.length;

    const nextCursor =
      rows.length > 0 && searchParamsEmpty ? rows[rows.length - 1].id : null;
    const prevCursor = rows.length > 0 && searchParamsEmpty ? rows[0].id : null;

    res.json({ books: rows, nextCursor, prevCursor });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

const addBook = async (
  req: Request<{}, {}, Omit<Book, "id">>,
  res: Response
) => {
  const { title, author, isbn, pages, rating } = req.body;

  if (!title || !author || !isbn || !pages || !rating) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    await bookService.addBook({ title, author, isbn, pages, rating });
    res.status(201).json({ message: "Book added successfully", status: true });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Failed to add book", status: false });
  }
};

const checkIsbnUnique = async (
  req: Request<{}, {}, {}, Pick<Book, "isbn">>,
  res: Response
) => {
  const { isbn } = req.query;

  try {
    if (!isbn) {
      res.status(400).json({ message: "ISBN is required" });
      return;
    }

    const isUnique = await bookService.isIsbnUnique(isbn);

    if (isUnique) {
      res.status(200).json({ message: "ISBN is unique", status: true });
    } else {
      res.status(409).json({ message: "ISBN already exists", status: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking ISBN uniqueness" });
  }
};

const bookController = {
  getBooks,
  addBook,
  checkIsbnUnique,
};

export default bookController;
