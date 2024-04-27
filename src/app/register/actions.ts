'use server';
import prisma from '@/lib/prisma';
import { hash } from 'bcrypt';
import { nanoid } from 'nanoid';
import z from 'zod';
import { passwordSetSchema, registerUserSchema } from './schema';

export async function createNewUser(data: z.infer<typeof registerUserSchema>) {
    try {
        const validetedData = registerUserSchema.safeParse(data);

        const findInstitution = await prisma.institution.findUnique({
            where: {
                id: Number(data.institution),
            },
        });

        if (!findInstitution) {
            throw new Error('Institution not found');
        }

        if (validetedData.success) {
            const registerID = nanoid();

            await prisma.user.create({
                data: { ...data, registerID, institution: { connect: { id: Number(data.institution) } } },
            });

            return {
                registerID,
                subdomain: findInstitution.subdomain,
            };
        } else {
            throw new Error('User already exist');
        }
    } catch (error) {
        throw new Error('User already exist');
    }
}

export async function createPassword(data: z.infer<typeof passwordSetSchema>) {
    try {
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
