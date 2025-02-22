import express from "express";
import bookController from "../controllers/bookController.js";

const router = express.Router();

router.get("/", bookController.getBooks);

router.get("/check-isbn", bookController.checkIsbnUnique);

router.post("/add-book", bookController.addBook);

export default router;
