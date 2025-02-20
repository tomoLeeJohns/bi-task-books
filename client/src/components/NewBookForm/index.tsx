import React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { TextField } from "@mui/material";

export const NewBookForm = () => {
  const [rating, setRating] = React.useState<number | null>(1);

  return (
    <div>
      <Box
        component="form"
        sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            error
            id="outlined-error"
            label="Title"
            defaultValue="Hello World"
          />
        </div>
        <div>
          <TextField
            error
            id="outlined-error-helper-text"
            label="Author"
            defaultValue="Hello World"
            helperText="Incorrect entry."
          />
        </div>
        <div>
          <TextField
            error
            id="outlined-error-helper-text"
            label="ISBN"
            defaultValue="Hello World"
            helperText="Incorrect entry."
          />
        </div>
      </Box>
      <Rating
        name="simple-controlled"
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
      />
    </div>
  );
};
