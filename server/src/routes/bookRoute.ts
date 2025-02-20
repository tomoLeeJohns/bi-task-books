import express from "express";
import bookController from "../controllers/bookController.js";

const router = express.Router();

router.get("/", bookController.getBooks);

router.post("/add-book", bookController.addBook);

router.post("/check-isbn", bookController.checkIsbnUnique);

export default router;
