import { z } from "zod";

const updateWishlistZodSchema = z.object({
	body: z.object({
		book: z.string({
			required_error: "Select a book",
		}),
	}),
});
const createOthersListZodSchema = z.object({
	body: z.object({
		list: z.object({}),
	}),
});

export const WishlistValidation = {
	updateWishlistZodSchema,
	createOthersListZodSchema,
};
