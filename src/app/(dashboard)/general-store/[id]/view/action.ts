'use server';
import prisma from '@/lib/prisma';

export const getGeneralStoreDetails = async (id: number) => {
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
            createdAt: true,
            updatedAt: true,
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

export const getGeneralStoreNotes = async (id: number) => {
    const response = await prisma.generalStoreNote.findMany({
        where: {
            generalStoreId: id,
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
