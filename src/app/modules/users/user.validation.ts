import { z } from "zod";

const createUserZodSchema = z.object({
	body: z.object({
		password: z.string({
			required_error: "Password is required",
		}),
		name: z
			.object({
				firstName: z.string().optional(),
				lastName: z.string().optional(),
			})
			.optional(),
		phoneNumber: z.string().optional(),
		email: z.string({
			required_error: "Email number is required",
		}),
		address: z.string().optional(),
	}),
});

const updateUserZodSchema = z.object({
	body: z.object({
		password: z.string().optional(),
		name: z
			.object({
				firstName: z.string().optional(),
				lastName: z.string().optional(),
			})
			.optional(),
		phoneNumber: z.string().optional(),
		email: z.string().optional(),
		address: z.string().optional(),
	}),
});

export const UserValidation = {
	createUserZodSchema,
	updateUserZodSchema,
};
