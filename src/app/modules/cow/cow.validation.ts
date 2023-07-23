import { z } from 'zod';
import {
    CowBreeds,
    CowCategories,
    CowLabels,
    CowLocations,
} from './cow.constant';

const createCowZodSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required',
            })
            .min(1),
        age: z
            .number({
                required_error: 'Age is required',
            })
            .positive(),
        price: z
            .number({
                required_error: 'Price is required',
            })
            .positive(),
        location: z.enum([...CowLocations] as [string, ...string[]], {
            required_error: 'Location is required',
        }),
        breed: z.enum([...CowBreeds] as [string, ...string[]], {
            required_error: 'Breed is required',
        }),
        weight: z
            .number({
                required_error: 'Weight is required',
            })
            .positive(),
        label: z.enum([...CowLabels] as [string, ...string[]]).optional(),
        category: z.enum([...CowCategories] as [string, ...string[]], {
            required_error: 'Category is required',
        }),
        seller: z
            .string({
                required_error: 'Seller is required',
            })
            .min(1),
    }),
});

const updateCowZodSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        age: z.number().positive().optional(),
        price: z.number().positive().optional(),
        location: z.enum([...CowLocations] as [string, ...string[]]).optional(),
        breed: z.enum([...CowBreeds] as [string, ...string[]]).optional(),
        weight: z.number().positive().optional(),
        label: z.enum([...CowLabels] as [string, ...string[]]).optional(),
        category: z
            .enum([...CowCategories] as [string, ...string[]])
            .optional(),
        seller: z.string().min(1).optional(),
    }),
});

export const CowValidation = {
    createCowZodSchema,
    updateCowZodSchema,
};
