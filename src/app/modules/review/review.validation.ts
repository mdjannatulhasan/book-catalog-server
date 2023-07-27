import { z } from "zod";

const createOrderZodSchema = z.object({
	body: z.object({
		book: z
			.string({
				required_error: "Book is required",
			})
			.min(1),
		buyer: z
			.string({
				required_error: "Buyer is required",
			})
			.min(1),
	}),
});

export const OrderValidation = {
	createOrderZodSchema,
};
