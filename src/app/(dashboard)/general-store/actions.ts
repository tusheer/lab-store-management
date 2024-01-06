'use server';
import prisma from '@/lib/prisma';

import { getActiveFinancialYear } from '@/app/action';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOption';
import { getServerSession } from 'next-auth';
import {
    distributionCreateFormSchema,
    DistributionCreateSchemaType,
    financialYearCreateSchema,
    FinancialYearCreateSchema,
    generalStoreCreateSchema,
    GeneralStoreCreateSchema,
    NoteCreateSchemaType,
    sourceCreateSchema,
    SourceCreateSchemaType,
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
                    storageLocation: data.storageLocation,
                    sources: {
                        create: {
                            totalPrice: Number(data.totalPrice),
                            purchasedAt: data.purchasedAt,
                            brandName: data.brandName,
                            sellerInformation: data.sellerInformation,
                            warrantyExpireDate: data.warrantyExpireDate,
                            warrantyType: data.warrantyType,
                            indentNo: Number(data.indentNo),
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
                    sources: true,
                },
            });

            if (data.note || data.images) {
                // Now create the generalStoreNotes entry
                await prisma.generalStoreNote.create({
                    data: {
                        note: data.note || '',
                        images: data.images, // Add this field only if your schema supports it
                        generalStoreId: generalStore.id,
                        userId: Number(userSession.user.id),
                    },
                });
            }

            if (!generalStore) {
                throw new Error('something wrong');
            }

            return generalStore;
        } else {
            throw new Error('something wrong');
        }
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const addNewSourceToGeneralStore = async (data: SourceCreateSchemaType) => {
    try {
        const validateData = sourceCreateSchema.safeParse(data);
        if (validateData.success) {
            const userAccount = await getServerSession(authOptions);

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
                    id: data.storeId,
                },
                data: {
                    stockAmount: Number(data.stock) + Number(data.quantity),
                    lastUpdatedBy: {
                        connect: {
                            id: Number(userAccount.user.id),
                        },
                    },
                    sources: {
                        create: {
                            totalPrice: Number(data.totalPrice),
                            purchasedAt: data.purchasedAt,
                            brandName: data.brandName,
                            sellerInformation: data.sellerInformation,
                            warrantyExpireDate: data.warrantyExpireDate,
                            warrantyType: data.warrantyType,
                            indentNo: Number(data.indentNo),
                            cashMemoNo: data.cashMemoNo,
                            cashMemoDate: data.cashMemoDate,
                            cashMemoImage: data.cashMemoImage,
                            quantity: Number(data.quantity),
                            unitName: data.unitName,
                            name: data.name,
                            finalQuantity: Number(data.quantity),
                            lastUpdatedBy: {
                                connect: {
                                    id: Number(userAccount.user.id),
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
                    sources: true,
                },
            });

            if (data.note || data.images) {
                // Now create the generalStoreNotes entry
                await prisma.generalStoreNote.create({
                    data: {
                        note: data.note || '',
                        images: data.images, // Add this field only if your schema supports it
                        generalStoreId: generalStore.id,
                        userId: Number(userAccount.user.id),
                    },
                });
            }

            if (!generalStore) {
                throw new Error('General store create error');
            }

            return generalStore;
        } else {
            console.log(validateData.error);
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

export const addNewDistributionToGeneralStore = async (data: DistributionCreateSchemaType, id: number) => {
    try {
        const validateData = distributionCreateFormSchema.safeParse(data);
        if (validateData.success) {
            const userAccount = await getServerSession(authOptions);

            if (!userAccount) {
                throw new Error('User not found');
            }

            const activeFinancialYear = await getActiveFinancialYear();

            if (!activeFinancialYear) {
                throw new Error('Financial year not found');
            }

            const generalStore = await prisma.generalStore.update({
                where: {
                    id: Number(id),
                },
                data: {
                    stockAmount: data.stock - Number(data.quantity),
                    lastUpdatedBy: {
                        connect: {
                            id: Number(userAccount.user.id),
                        },
                    },
                    distributions: {
                        create: {
                            department: data.department,
                            allocatedAt: data.allocatedAt,
                            personName: data.personName,
                            name: data.name,
                            shopName: data.shopName,
                            note: data.note,
                            images: data.images,
                            quantity: Number(data.quantity),
                            unitName: data.unitName,
                            lastUpdatedBy: {
                                connect: {
                                    id: Number(userAccount.user.id),
                                },
                            },
                            financialYear: {
                                connect: {
                                    id: activeFinancialYear.id,
                                },
                            },
                            finalQuantity: data.stock - Number(data.quantity),
                            indentNo: Number(data.indentNo),
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
                    distributions: true,
                },
            });

            if (!generalStore) {
                throw new Error('General store create error');
            }

            return generalStore;
        } else {
            throw new Error("Form data isn't valid");
        }
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const createNewGeneralStoreNote = async (data: NoteCreateSchemaType, id: number) => {
    try {
        const userAccount = await getServerSession(authOptions);

        if (!userAccount) {
            throw new Error('User not found');
        }

        const generalStoreNote = await prisma.generalStoreNote.create({
            data: {
                note: data.note,
                images: data.images,
                generalStoreId: Number(id),
                userId: Number(userAccount.user.id),
            },
        });

        if (!generalStoreNote) {
            throw new Error('General store note create error');
        }

        return generalStoreNote;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};
