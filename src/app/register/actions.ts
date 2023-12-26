'use server';
import prisma from '@/lib/prisma';
import { hash } from 'bcrypt';
import { nanoid } from 'nanoid';
import z from 'zod';
import { passwordSetSchema, registerUserSchema } from './schema';

export async function createNewUser(data: z.infer<typeof registerUserSchema>) {
    try {
        // Validate the form data here if needed
        // Generate uniqueID here
        const validetedData = registerUserSchema.safeParse(data);
        if (validetedData.success) {
            const registerID = nanoid();

            await prisma.user.create({
                data: { ...data, registerID },
            });
            return registerID;
        } else {
            throw new Error('something wrong');
        }

        // Handle successful registration (redirect, display message, etc.)
    } catch (error) {
        throw new Error('something wrong');
    }
}

export async function createPassword(data: z.infer<typeof passwordSetSchema>) {
    try {
        console.log(data);

        const isUser = await prisma.user.findUnique({
            where: {
                registerID: data.registerID,
            },
        });
        if (!isUser) {
            throw new Error('user not exist');
        }

        const password = await hash(data.password, 10);

        const res = await prisma.user.update({
            where: {
                registerID: data.registerID,
            },
            data: {
                password: password,
                registerID: null,
            },
        });

        if (!res) {
            throw new Error('something wrong');
        }

        return res;
    } catch (error) {
        throw new Error('something wrong');
    }
}
