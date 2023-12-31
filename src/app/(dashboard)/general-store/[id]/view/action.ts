'use server';
import prisma from '@/lib/prisma';

export const getItemDetails = async (id: number) => {
    const response = await prisma.generalStore.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        select: {
            financialYear: {
                select: {
                    name: true,
                    id: true,
                    isActive: true,
                },
            },
            unitName: true,
            alertWhenStockAmountIsLessThan: true,
            name: true,
            stockAmount: true,
            type: true,
            storageLocation: true,
            id: true,
            lastUpdatedBy: true,
            status: true,
            _count: {
                select: {
                    sources: true,
                    distributions: true,
                    generalStoreNotes: true,
                },
            },
        },
    });

    return response;
};
