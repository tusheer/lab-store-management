'use server';
import prisma from '@/lib/prisma';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { generalStoreCreateSchema, GeneralStoreCreateSchema } from './schema';

export const createNewGeneralStoreItem = async (data: GeneralStoreCreateSchema) => {
    try {
        const validateData = generalStoreCreateSchema.safeParse(data);

        if (validateData.success) {
            const userSession = await getServerSession(authOptions);

            if (!userSession) {
                throw new Error('user not found');
            }

            const generalStore = await prisma.generalStore.create({
                data: {
                    name: data.name,
                    alertWhenStockAmountIsLessThan: Number(data.alertWhenStockAmountIsLessThan),
                    status: data.status,
                    stockAmount: Number(data.quantity),
                    unitName: data.unitName,
                    type: data.type,
                    lastUpdatedBy: {
                        connect: {
                            id: Number(userSession.user.id),
                        },
                    },
                    purchases: {
                        create: {
                            totalPrice: Number(data.totalPrice),
                            purchasedAt: data.purchasedAt,
                            brandName: data.brandName,
                            sellerInformation: data.sellerInformation,
                            warrantyExpireDate: data.warrantyExpireDate,
                            warrantyType: data.warrantyType,
                            intendNumber: Number(data.intendNumber),
                            cashMemoNo: data.cashMemoNo,
                            cashMemoDate: data.cashMemoDate,
                            cashMemoImage: data.cashMemoImage,
                            quantity: Number(data.quantity),
                            unitName: data.unitName,
                            name: data.name,
                            finalQuantity: Number(data.quantity),
                            User: {
                                connect: {
                                    id: Number(userSession.user.id),
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
                    stockAmount: Number(data.quantity),
                    lastUpdatedBy: {
                        connect: {
                            id: 1,
                        },
                    },
                    purchases: {
                        create: {
                            totalPrice: Number(data.totalPrice),
                            purchasedAt: data.purchasedAt,
                            brandName: data.brandName,
                            sellerInformation: data.sellerInformation,
                            warrantyExpireDate: data.warrantyExpireDate,
                            warrantyType: data.warrantyType,
                            intendNumber: Number(data.intendNumber),
                            cashMemoNo: data.cashMemoNo,
                            cashMemoDate: data.cashMemoDate,
                            cashMemoImage: data.cashMemoImage,
                            quantity: Number(data.quantity),
                            unitName: data.unitName,
                            name: data.name,
                            finalQuantity: Number(data.quantity),
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
