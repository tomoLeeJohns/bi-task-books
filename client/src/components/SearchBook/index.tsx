import React, { useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Controller, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { SEARCH_BOOK_SCHEMA } from "../../schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useBooks } from "../../hooks";

interface FormData {
  title: string;
  author: string;
}

const usePrev = (value: string) => {
  const ref = React.useRef(value);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

const SearchBooks: React.FC = () => {
  const [filters, setFilters] = React.useState({ title: "", author: "" });
  const [cursor, setCursor] = React.useState<number | null>(null);
  const [prevCursor, setPrevCursor] = React.useState<number | null>(null);
  const { data, isLoading } = useBooks(
    {
      cursor,
      prevCursor,
      ...filters,
    },
    {
      onSuccess: (newData) => {
        setCursor(newData.nextCursor);
        setPrevCursor(newData.prevCursor);
      },
    }
  );
  const { handleSubmit, control, watch, reset } = useForm<FormData>({
    resolver: yupResolver(SEARCH_BOOK_SCHEMA) as unknown as Resolver<
      FormData,
      any
    >,
    defaultValues: {
      title: "",
      author: "",
    },
  });

  const title = watch("title");
  const author = watch("author");
  const prevAuthor = usePrev(author);
  const prevTitle = usePrev(title);

  useEffect(() => {
    if (
      (prevAuthor !== author || prevTitle !== title) &&
      !title.length &&
      !author.length
    ) {
      setCursor(null);
      setPrevCursor(null);
      setFilters({ title: "", author: "" });
      reset();
    }
  }, [title, author, prevAuthor, prevTitle]);

  const handleSearch: SubmitHandler<FormData> = async (data) => {
    setCursor(null);
    setPrevCursor(null);
    setFilters((prev) => ({ ...prev, ...data }));
  };

  const handleNextPage = () => {
    if (data?.nextCursor) {
      setPrevCursor(null);
      setCursor(data.nextCursor);
    }
  };

  const handlePreviousPage = () => {
    if (data?.prevCursor) {
      setCursor(null);
      setPrevCursor(data.prevCursor);
    }
  };

  return (
    <Box>
      <Box
        component="form"
        onSubmit={handleSubmit(handleSearch)}
        sx={{ mt: 2 }}
      >
        <Box display="flex" gap={2}>
          <Controller
            name="author"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
              <TextField
                label="Author"
                fullWidth
                sx={{ flex: 1 }}
                {...field}
                error={invalid}
                {...(error ? { helperText: error.message } : {})}
              />
            )}
          />
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
              <TextField
                label="Title"
                fullWidth
                sx={{ flex: 1 }}
                {...field}
                error={invalid}
                {...(error ? { helperText: error.message } : {})}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ alignSelf: "start", height: "54px" }}
          >
            Search
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          margin={20}
        >
          <CircularProgress size={50} />
        </Box>
      ) : (
        <Box>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>ISBN</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Pages</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.id}</TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell>{book.rating}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.pages}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handlePreviousPage}
              disabled={!data?.prevCursor || data?.prevCursor === 1}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              onClick={handleNextPage}
              disabled={!data?.nextCursor}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SearchBooks;
