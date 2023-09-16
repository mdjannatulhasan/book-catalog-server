import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BookValidation } from "./book.validation";
import { BookController } from "./book.controller";
import auth from "../../middlewares/auth";
import authGeneral from "../../middlewares/authGeneral";

const router = express.Router();

router.post("/", auth(), validateRequest(BookValidation.createBookZodSchema), BookController.createBook);

router.get("/my-books", auth(), BookController.getMyBooks);

router.get("/:id", authGeneral(), BookController.getSingleBook);

router.patch("/:id", auth(), validateRequest(BookValidation.updateBookZodSchema), BookController.updateBook);

router.delete("/:id", auth(), BookController.deleteBook);

router.get("/", authGeneral(), BookController.getAllBook);

export const BookRoutes = router;
