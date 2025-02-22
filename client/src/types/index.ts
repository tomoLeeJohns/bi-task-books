export interface Book {
  title: string;
  author: string;
  isbn: string;
  pages: string;
  rating: number;
  id: number;
}

export type FormData = Omit<Book, "id">;

export interface GetBooksParams {
  title: string | null;
  author: string | null;
  cursor: number | null;
  prevCursor: number | null;
}

export interface GetBooksResponse {
  books: Book[];
  nextCursor: number;
  prevCursor: number;
}
