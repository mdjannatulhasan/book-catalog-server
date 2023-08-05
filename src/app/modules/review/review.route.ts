import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewValidation } from "./review.validation";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post("/", validateRequest(ReviewValidation.createReviewZodSchema), auth(), ReviewController.createReview);

// router.get("/:id", auth(), ReviewController.getSingleReview);
router.get("/:id", ReviewController.getAllReview);

// router.delete('/:id', ReviewController.deleteReview);

// router.get("/", auth(), ReviewController.getAllReview);

export const ReviewRoutes = router;
