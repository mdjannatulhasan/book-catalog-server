import { z } from 'zod';
import { role } from './admin.constant';

const createAdminZodSchema = z.object({
    body: z.object({
        password: z.string({
            required_error: 'Password is required',
        }),
        name: z.object({
            firstName: z.string({
                required_error: 'First name is required',
            }),
            lastName: z.string({
                required_error: 'Last name is required',
            }),
        }),
        role: z.enum([...role] as [string, ...string[]]).optional(),
        phoneNumber: z.string({
            required_error: 'Contact number is required',
        }),
        address: z.string({
            required_error: 'Address is required',
        }),
    }),
});

const updateAdminZodSchema = z.object({
    body: z.object({
        password: z.string().optional(),
        name: z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
        }),
        role: z.enum([...role] as [string, ...string[]]).optional(),
        phoneNumber: z.string().optional(),
        address: z.string().optional(),
    }),
});

export const AdminValidation = {
    createAdminZodSchema,
    updateAdminZodSchema,
};
