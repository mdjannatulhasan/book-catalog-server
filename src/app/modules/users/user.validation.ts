import { z } from "zod";

const createUserZodSchema = z.object({
	body: z.object({
		password: z.string().optional(),
		name: z.object({
			firstName: z.string({
				required_error: "First name is required",
			}),
			lastName: z.string({
				required_error: "Last name is required",
			}),
		}),
		phoneNumber: z.string({
			required_error: "Contact number is required",
		}),
		email: z.string({
			required_error: "Email number is required",
		}),
		address: z.string({
			required_error: "Address is required",
		}),
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
