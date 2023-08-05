import { z } from "zod";

const createWishlistZodSchema = z.object({
	body: z.object({
		code: z.string().optional(),
		title: z.string({
			required_error: "Title is required",
		}),
		coverImage: z.string().optional(),
		price: z.number().optional(),
		author: z.string({
			required_error: "Author is required",
		}),
		genre: z.string({
			required_error: "Genre is required",
		}),
		publicationDate: z.string({
			required_error: "Publication date is required",
		}),
		reviews: z.number().optional(),
	}),
});

const updateWishlistZodSchema = z.object({
	body: z.object({
		code: z.string().optional(),
		title: z.string(),
		coverImage: z.string().optional(),
		price: z.number().optional(),
		author: z.string().optional(),
		genre: z.string().optional(),
		publicationDate: z.string().optional(),
		reviews: z.number().optional(),
	}),
});

export const WishlistValidation = {
	createWishlistZodSchema,
	updateWishlistZodSchema,
};
