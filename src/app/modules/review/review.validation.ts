import { z } from "zod";

const createReviewZodSchema = z.object({
	body: z.object({
		book: z.string({
			required_error: "Book is required",
		}),
		reviews: z.string({
			required_error: "Review is required",
		}),
	}),
});

export const ReviewValidation = {
	createReviewZodSchema,
};
