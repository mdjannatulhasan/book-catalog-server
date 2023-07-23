import { z } from 'zod';
import { userRole } from './user.constant';

const createUserZodSchema = z
    .object({
        body: z.object({
            password: z.string().optional(),
            name: z.object({
                firstName: z.string({
                    required_error: 'First name is required',
                }),
                lastName: z.string({
                    required_error: 'Last name is required',
                }),
            }),
            role: z.enum([...userRole] as [string, ...string[]]),
            phoneNumber: z.string({
                required_error: 'Contact number is required',
            }),
            address: z.string({
                required_error: 'Address is required',
            }),
            budget: z.number({
                required_error: 'Budget is required',
            }),
            income: z.number({
                required_error: 'Income is required',
            }),
        }),
    })
    .refine(
        data => {
            if (data.body.role === 'buyer') {
                return data.body.budget > 0;
            }
            return true;
        },
        {
            message: 'Budget must be greater than 0 for buyers',
        }
    );

const updateUserZodSchema = z.object({
    body: z.object({
        password: z.string().optional(),
        name: z
            .object({
                firstName: z.string().optional(),
                lastName: z.string().optional(),
            })
            .optional(),
        role: z.enum([...userRole] as [string, ...string[]]).optional(),
        phoneNumber: z.string().optional(),
        address: z.string().optional(),
        budget: z.number().optional(),
        income: z.number().optional(),
    }),
});

export const UserValidation = {
    createUserZodSchema,
    updateUserZodSchema,
};
