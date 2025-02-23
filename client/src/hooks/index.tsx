import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { FormData, GetBooksParams, GetBooksResponse } from "../types/index.js";

const addBook = async (formData: FormData) => {
  const response = await fetch("/api/books/add-book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
export const useAddBook = () => {
  const { mutateAsync, ...rest } = useMutation<unknown, Error, FormData>({
    mutationFn: addBook,
  });

  return {
    addBook: (data: FormData) => mutateAsync(data),
    ...rest,
  };
};

const fetchBooks = async (queryParams: GetBooksParams) => {
  const params = Object.fromEntries(
    Object.entries(queryParams).filter(([_, value]) => Boolean(value))
  );

  const searchParams = new URLSearchParams(params).toString();
  const response = await fetch(
    `/api/books?limit=10${Object.keys(params).length ? `&${searchParams}` : ""}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
export const useBooks = (queryParams: GetBooksParams) => {
  const { data, isLoading } = useQuery<
    GetBooksResponse,
    Error,
    GetBooksResponse
  >({
    queryKey: ["books", { ...queryParams }],
    queryFn: () => fetchBooks(queryParams),
    placeholderData: keepPreviousData,
  });

  return { data, isLoading };
};
