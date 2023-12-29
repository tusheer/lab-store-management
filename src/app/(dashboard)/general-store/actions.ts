'use server';
import prisma from '@/lib/prisma';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import {
    financialYearCreateSchema,
    FinancialYearCreateSchema,
    generalStoreCreateSchema,
    GeneralStoreCreateSchema,
} from './schema';

export const createNewGeneralStoreItem = async (data: GeneralStoreCreateSchema) => {
    try {
        const validateData = generalStoreCreateSchema.safeParse(data);

        if (validateData.success) {
            const userSession = await getServerSession(authOptions);

            if (!userSession) {
                throw new Error('user not found');
            }

            const activeFinancialYear = await prisma.financialYear.findFirst({
                where: {
                    isActive: true,
                },
            });

            if (!activeFinancialYear) {
                throw new Error('financial year not found');
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
                            lastUpdatedBy: {
                                connect: {
                                    id: Number(userSession.user.id),
                                },
                            },
                            note: data.note,
                            images: data.images,
                            financialYear: {
                                connect: {
                                    id: activeFinancialYear.id,
                                },
                            },
                        },
                    },
                    financialYear: {
                        connect: {
                            id: activeFinancialYear.id,
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
                throw new Error('User not found');
            }

            const activeFinancialYear = await prisma.financialYear.findFirst({
                where: {
                    isActive: true,
                },
            });

            if (!activeFinancialYear) {
                throw new Error('Financial year not found');
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
                            lastUpdatedBy: {
                                connect: {
                                    id: 1,
                                },
                            },
                            note: data.note,
                            images: data.images,
                            financialYear: {
                                connect: {
                                    id: activeFinancialYear.id,
                                },
                            },
                        },
                    },
                    financialYear: {
                        connect: {
                            id: activeFinancialYear.id,
                        },
                    },
                },
                include: {
                    lastUpdatedBy: true,
                    purchases: true,
                },
            });

            if (!generalStore) {
                throw new Error('General store create error');
            }

            return generalStore;
        } else {
            throw new Error('something wrong');
        }
    } catch (error) {
        throw new Error(String(error));
    }
};

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

        return financialYear;
    } catch (error) {
        throw new Error(String(error));
    }
};
