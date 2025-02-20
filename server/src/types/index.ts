export interface Book {
  title: string;
  author: string;
  isbn: string;
  numberOfPages: number;
  rating: number;
  id: number;
}

export interface GetBooksParams {
  title?: string;
  isbn?: string;
  cursor?: number;
  prevCursor?: number;
  limit?: number;
}
