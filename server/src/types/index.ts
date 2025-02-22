export interface Book {
  title: string;
  author: string;
  isbn: string;
  pages: number;
  rating: number;
  id: number;
}

export interface GetBooksParams {
  title?: string;
  author?: string;
  cursor?: number;
  prevCursor?: number;
  limit?: number;
}
