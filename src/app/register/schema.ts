import { z } from 'zod';

export const registerUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().min(1),
    designation: z.string().min(1),
    department: z.string().min(1),
    institution: z.string().min(1),
});

export const passwordSetFormSchema = z.object({
    password: z.string().min(6),
});
export const passwordSetSchema = z.object({
    password: z.string().min(6),
    registerID: z.string().min(1),
});
