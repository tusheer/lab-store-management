'use server';
import prisma from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const getActiveFinancialYear = unstable_cache(async () => {
    const activeFinancialYear = await prisma.financialYear.findFirst({
        where: {
            isActive: true,
        },
    });

    if (!activeFinancialYear) {
        return null;
    }

    return {
        name: activeFinancialYear.name,
        id: activeFinancialYear.id,
    };
}, ['activeFinancialYear']);
