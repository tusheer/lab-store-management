import { z } from 'zod';

const bdPhoneNumberPattern = /^01[3-9]\d{8}$/;

// Create a Zod schema for the phone number
const bdPhoneNumberSchema = z
    .string()
    .optional() // This allows the value to be `undefined`
    .or(z.literal('')) // This allows the value to also be an empty string
    .refine((val) => val === '' || val === undefined || bdPhoneNumberPattern.test(val), {
        message: 'Invalid BD phone number',
    });
export const updateUserSchema = z.object({
    email: z.string().email().optional(),
    name: z.string().min(1).optional(),
    phone: bdPhoneNumberSchema,
    address: z.string().optional(),
    avatar: z
        .object({
            url: z.string(),
            key: z.string(),
        })
        .optional(),
    department: z.string().min(1).optional(),
    designation: z.string().min(1).optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
