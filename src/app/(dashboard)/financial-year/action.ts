'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/authOption';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidateTag, unstable_cache } from 'next/cache';
import { FinancialYearCreateSchema, financialYearCreateSchema } from '../general-store/schema';

export const getFinancialYears = unstable_cache(async () => {
    const finalcialYear = await prisma.financialYear.findMany();
    return finalcialYear;
}, ['financialYear']);

export const createNewActiveFinancialYear = async (data: FinancialYearCreateSchema) => {
    try {
        const validateData = financialYearCreateSchema.safeParse(data);

        if (validateData.success) {
            const userSession = await getServerSession(authOptions);

            if (!userSession) {
                throw new Error('user not found');
            }

            if (!(data.date[0] && data.date[1])) {
                throw new Error('Start date and end date must be required');
            }

            const activeFinancialYear = await prisma.financialYear.findFirst({
                where: {
                    isActive: true,
                },
            });

            if (activeFinancialYear) {
                throw new Error('Active financial year already exist');
            }

            const financialYear = await prisma.financialYear.create({
                data: {
                    name: data.name,
                    startDate: data.date[0],
                    endDate: data.date[1],
                    isActive: true,
                },
            });

            if (!financialYear) {
                throw new Error('Something wrong');
            }

            revalidateTag('activeFinancialYear');
            revalidateTag('financialYear');
            return financialYear;
        } else {
            throw new Error('Something wrong');
        }
    } catch (error) {
        throw new Error(String(error));
    }
};

export const inActiveFinancialYear = async (id: number) => {
    try {
        const userSession = await getServerSession(authOptions);

        if (!userSession) {
            throw new Error('User not found');
        }

        const activeFinancialYear = await prisma.financialYear.findFirst({
            where: {
                isActive: true,
            },
        });

        if (activeFinancialYear?.id !== id) {
            throw new Error('Something wrong');
        }

        const financialYear = await prisma.financialYear.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
        });

        if (!financialYear) {
            throw new Error('Something wrong');
        }

        revalidateTag('activeFinancialYear');
        revalidateTag('financialYear');

        return financialYear;
    } catch (error) {
        throw new Error(String(error));
    }
};
