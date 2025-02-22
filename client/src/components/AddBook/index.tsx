import React from "react";
import { Controller, useForm, SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Box,
  Rating,
  Alert,
  AlertTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ADD_BOOK_SCHEMA } from "../../schemas/index.js";
import { FormData } from "../../types/index.js";
import { useAddBook } from "../../hooks/index.js";

const AddBook: React.FC = () => {
  const { addBook, isSuccess, isError, isPending, reset } = useAddBook();
  const {
    handleSubmit,
    control,
    reset: resetForm,
  } = useForm<FormData>({
    resolver: yupResolver(ADD_BOOK_SCHEMA) as unknown as Resolver<
      FormData,
      any
    >,
    defaultValues: {
      title: "",
      isbn: "",
      author: "",
      pages: "",
      rating: 1,
    },
  });
  const handleAddBook: SubmitHandler<FormData> = async (data) => {
    await addBook(data);
    resetForm();
  };
  const status = isSuccess ? "success" : isError ? "error" : null;

  return (
    <Box component="form" onSubmit={handleSubmit(handleAddBook)} sx={{ mt: 2 }}>
      {status && (
        <Alert
          severity={status}
          sx={{ mb: 2, mt: 2 }}
          action={
            <IconButton color="inherit" size="small" onClick={reset}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle>{status}</AlertTitle>
          {isSuccess &&
            "Here is a gentle confirmation that your action was successful."}
          {isError &&
            "Here is a gentle confirmation that your action was not successful."}
        </Alert>
      )}
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState: { error, invalid } }) => (
          <TextField
            label="Title"
            fullWidth
            sx={{ mb: 2 }}
            {...field}
            error={invalid}
            {...(error ? { helperText: error.message } : {})}
          />
        )}
      />
      <Controller
        name="isbn"
        control={control}
        render={({ field, fieldState: { error, invalid } }) => (
          <TextField
            label="ISBN"
            fullWidth
            sx={{ mb: 2 }}
            {...field}
            error={invalid}
            {...(error ? { helperText: error.message } : {})}
          />
        )}
      />
      <Controller
        name="author"
        control={control}
        render={({ field, fieldState: { error, invalid } }) => (
          <TextField
            label="Author"
            fullWidth
            sx={{ mb: 2 }}
            {...field}
            error={invalid}
            {...(error ? { helperText: error.message } : {})}
          />
        )}
      />
      <Controller
        name="pages"
        control={control}
        render={({ field, fieldState: { error, invalid } }) => (
          <TextField
            label="Pages"
            fullWidth
            sx={{ mb: 2 }}
            {...field}
            error={invalid}
            {...(error ? { helperText: error.message } : {})}
          />
        )}
      />
      <Controller
        name="rating"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <input type="hidden" name="rating" value={value} />
            <Rating
              sx={{ mb: 4, mt: 1 }}
              name="simple-controlled"
              value={value}
              onChange={(_, val) => {
                if (val) onChange(val);
              }}
            />
          </>
        )}
      />
      <Button type="submit" variant="contained" fullWidth disabled={isPending}>
        Add Book
      </Button>
    </Box>
  );
};

export default AddBook;
