'use server';
import prisma from '@/lib/prisma';

import { getActiveFinancialYear } from '@/app/action';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOption';
import { getServerSession } from 'next-auth';
import {
    distributionCreateFormSchema,
    DistributionCreateSchemaType,
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
                            institution: {
                                connect: {
                                    id: Number(userSession.user.institution.id),
                                },
                            },
                        },
                    },
                    generalStoreHistory: {
                        create: {
                            label: `${userSession.user.name} created a new item, initial quantity was ${data.quantity}`,
                            userId: Number(userSession.user.id),
                            institutionId: Number(userSession.user.institution.id),
                        },
                    },
                    financialYear: {
                        connect: {
                            id: activeFinancialYear.id,
                        },
                    },
                    institution: {
                        connect: {
                            id: Number(userSession.user.institution.id),
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
                        institutionId: Number(userSession.user.institution.id),
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
                            institution: {
                                connect: {
                                    id: Number(userAccount.user.institution.id),
                                },
                            },
                        },
                    },
                    generalStoreHistory: {
                        create: {
                            label: `${userAccount.user.name} added ${data.quantity} ${data.unitName} of ${data.name}`,
                            userId: Number(userAccount.user.id),
                            institutionId: Number(userAccount.user.institution.id),
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
                        institutionId: Number(userAccount.user.institution.id),
                    },
                });
            }

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
                            institution: {
                                connect: {
                                    id: Number(userAccount.user.institution.id),
                                },
                            },
                        },
                    },
                    financialYear: {
                        connect: {
                            id: activeFinancialYear.id,
                        },
                    },
                    generalStoreHistory: {
                        create: {
                            label: `${userAccount.user.name} distributed ${data.quantity} ${data.unitName} of ${
                                data.name
                            } to ${data.personName}, ${data.department} ${data.shopName && `(${data.shopName})`}`,
                            userId: Number(userAccount.user.id),
                            institutionId: Number(userAccount.user.institution.id),
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
                institutionId: Number(userAccount.user.institution.id),
            },
        });

        await prisma.generalStore.update({
            where: {
                id: Number(id),
            },
            data: {
                generalStoreHistory: {
                    create: {
                        label: `${userAccount.user.name} added a note`,
                        userId: Number(userAccount.user.id),
                        institutionId: Number(userAccount.user.institution.id),
                    },
                },
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
