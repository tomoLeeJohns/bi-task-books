import * as yup from "yup";

const isIsbnUnique = async (isbn: string) => {
  const response = await fetch(`/api/books/check-isbn?isbn=${isbn}`);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const data: { status: boolean } = await response.json();
  return data.status;
};

export const ADD_BOOK_SCHEMA = yup.object().shape({
  title: yup
    .string()
    .required("Title is a required field")
    .matches(
      /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
      "Title can only contain letters and spaces"
    ),
  author: yup
    .string()
    .required("Author is a required field")
    .matches(
      /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
      "Author can only contain letters and spaces"
    ),
  isbn: yup
    .string()
    .required("ISBN is a required field")
    .matches(/^\d{13}$/, "ISBN has to be 13 digits long")
    .test("is-unique", "ISBN already exists", async (value) => {
      if (!value) return false;
      try {
        await isIsbnUnique(value);
        return true;
      } catch (error) {
        return false;
      }
    }),
  pages: yup
    .number()
    .typeError("Liczba stron musi być liczbą")
    .required("Pages is a required field")
    .positive("Pages has to be greater than 0")
    .integer("Pages has to be an integer"),
  rating: yup.number().required(),
});

export const SEARCH_BOOK_SCHEMA = yup.object().shape(
  {
    title: yup.string().when(["author"], {
      is: (author: string | undefined) => !author,
      then: () =>
        yup.string().when(["title"], {
          is: (title: string | undefined) => !title,
          then: () => yup.string().notRequired(),
          otherwise: () =>
            yup
              .string()
              .required("Title is a required field")
              .matches(
                /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
                "Title can only contain letters and spaces"
              ),
        }),
      otherwise: () => yup.string().notRequired(),
    }),
    author: yup.string().when(["title"], {
      is: (title: string | undefined) => !title,
      then: () =>
        yup.string().when(["author"], {
          is: (isbn: string | undefined) => !isbn,
          then: () => yup.string().notRequired(),
          otherwise: () =>
            yup
              .string()
              .required("Author is a required field")
              .matches(
                /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
                "Title can only contain letters and spaces"
              ),
        }),
      otherwise: () => yup.string().notRequired(),
    }),
  },
  [["title", "author"]]
);
