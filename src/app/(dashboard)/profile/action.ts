'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/authOption';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { UpdateUserSchema } from './schema';

export const updateProfile = async (data: UpdateUserSchema) => {
    try {
        const userSession = await getServerSession(authOptions);

        if (!userSession) {
            throw new Error('User not found');
        }

        const user = await prisma.user.update({
            where: {
                id: Number(userSession.user.id),
            },
            data: {
                ...data,
                avatar: data.avatar ? data.avatar : undefined,
                phone: typeof data.phone === 'number' ? String(data.phone) : data.phone,
            },
        });

        if (!user) {
            throw new Error('Something wrong');
        }

        return user;
    } catch (error) {
        throw new Error(String(error));
    }
};

export const getMyProfile = async () => {
    const session = await getServerSession(authOptions);
    const response = await prisma.user.findUnique({
        select: {
            email: true,
            id: true,
            address: true,
            name: true,
            phone: true,
            designation: true,
            department: true,
            avatar: true,
        },
        where: {
            id: Number(session?.user.id),
        },
    });
    return response;
};
