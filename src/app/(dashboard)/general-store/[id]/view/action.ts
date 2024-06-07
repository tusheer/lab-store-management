'use server';
import prisma from '@/lib/prisma';

export const getGeneralStoreItemDetails = async (id: number) => {
    const response = await prisma.storeItem.findUnique({
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
            createdAt: true,
            updatedAt: true,
            _count: {
                select: {
                    sources: true,
                    distributions: true,
                    storeItemNotes: true,
                },
            },
        },
    });

    return response;
};

export const getGeneralStoreNotes = async (id: number) => {
    const response = await prisma.storeItemNote.findMany({
        where: {
            storeItemId: id,
        },
        select: {
            id: true,
            note: true,
            createdAt: true,
            updatedAt: true,
            images: true,
            user: {
                select: {
                    name: true,
                    avatar: true,
                    designation: true,
                    department: true,
                    email: true,
                    id: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return response;
};
