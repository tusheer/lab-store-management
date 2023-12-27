'use server';
import prisma from '@/lib/prisma';

import { getServerSession } from 'next-auth';
import { generalStoreCreateSchema, GeneralStoreCreateSchema } from './schema';

export const createNewGeneralStoreItem = async (data: GeneralStoreCreateSchema) => {
    try {
        const validateData = generalStoreCreateSchema.safeParse(data);
        if (validateData.success) {
            const userAccount = await getServerSession();

            if (!userAccount) {
                throw new Error('user not found');
            }

            const generalStore = await prisma.generalStore.create({
                data: {
                    name: data.name,
                    alertWhenStockAmountIsLessThan: data.alertWhenStockAmountIsLessThan,
                    status: data.status,
                    stockAmount: data.quantity,
                    unitName: data.unitName,
                    type: data.type,
                    lastUpdatedBy: {
                        connect: {
                            id: 1,
                        },
                    },
                    purchases: {
                        create: {
                            totalPrice: data.price,
                            purchasedAt: data.purchasedAt,
                            brandName: data.brandName,
                            sellerInformation: data.sellerInformation,
                            warrantyExpireDate: data.warrantyExpireDate,
                            warrantyType: data.warrantyType,
                            intendNumber: data.intendNumber,
                            cashMemoNo: data.cashMemoNo,
                            cashMemoDate: data.cashMemoDate,
                            cashMemoImage: data.cashMemoImage,
                            quantity: data.quantity,
                            unitName: data.unitName,
                            name: data.name,
                            finalQuantity: data.quantity,
                            User: {
                                connect: {
                                    id: 1,
                                },
                            },
                            note: data.note,
                            images: data.images,
                        },
                    },
                },
                include: {
                    lastUpdatedBy: true,
                    purchases: true,
                },
            });

            if (!generalStore) {
                throw new Error('something wrong');
            }

            return generalStore;
        } else {
            throw new Error('something wrong');
        }
    } catch (error) {
        throw new Error(String(error));
    }
};

export const addNewPurchaseToGeneralStore = async (data: GeneralStoreCreateSchema, id: number) => {
    try {
        const validateData = generalStoreCreateSchema.safeParse(data);
        if (validateData.success) {
            const userAccount = await getServerSession();

            if (!userAccount) {
                throw new Error('user not found');
            }

            const generalStore = await prisma.generalStore.update({
                where: {
                    id,
                },
                data: {
                    stockAmount: data.quantity,
                    lastUpdatedBy: {
                        connect: {
                            id: 1,
                        },
                    },
                    purchases: {
                        create: {
                            totalPrice: data.price,
                            purchasedAt: data.purchasedAt,
                            brandName: data.brandName,
                            sellerInformation: data.sellerInformation,
                            warrantyExpireDate: data.warrantyExpireDate,
                            warrantyType: data.warrantyType,
                            intendNumber: data.intendNumber,
                            cashMemoNo: data.cashMemoNo,
                            cashMemoDate: data.cashMemoDate,
                            cashMemoImage: data.cashMemoImage,
                            quantity: data.quantity,
                            unitName: data.unitName,
                            name: data.name,
                            finalQuantity: data.quantity,
                            User: {
                                connect: {
                                    id: 1,
                                },
                            },
                            note: data.note,
                            images: data.images,
                        },
                    },
                },
                include: {
                    lastUpdatedBy: true,
                    purchases: true,
                },
            });

            if (!generalStore) {
                throw new Error('something wrong');
            }

            return generalStore;
        } else {
            throw new Error('something wrong');
        }
    } catch (error) {
        throw new Error(String(error));
    }
};
