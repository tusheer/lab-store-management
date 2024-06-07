'use server';
import { getActiveFinancialYear } from '@/app/action';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOption';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import {
    distributionCreateFormSchema,
    DistributionCreateSchemaType,
    generalStoreCreateSchema,
    GeneralStoreCreateSchema,
    NoteCreateSchemaType,
    SeparateItemSchemaType,
    sourceCreateSchema,
    SourceCreateSchemaType,
    UpdateStoreItemStatusSchemaType,
} from './schema';

type StoreParams = {
    isGeneralStore?: boolean;
    id?: number;
};

export const getStore = async ({ isGeneralStore = false, id }: StoreParams) => {
    try {
        // Fetch user session
        const userSession = await getServerSession(authOptions);
        if (!userSession) {
            throw new Error('User not found');
        }

        // Define query conditions
        const queryConditions: Prisma.StoreWhereInput = {
            institution: {
                id: Number(userSession.user.institution.id),
            },
        };

        // Add condition based on whether it is a general store or a specific store
        if (isGeneralStore) {
            queryConditions['isGeneralStore'] = true;
        } else if (id !== undefined) {
            queryConditions['id'] = id;
        } else {
            throw new Error('Store ID must be provided if not fetching the general store');
        }

        // Fetch store based on conditions
        const store = await prisma.store.findFirst({
            where: queryConditions,
        });

        if (!store) {
            throw new Error('Store not found');
        }

        return store;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const createNewStoreItem = async (data: GeneralStoreCreateSchema, storeParams: StoreParams) => {
    try {
        const validateData = generalStoreCreateSchema.safeParse(data);

        if (validateData.success) {
            const userSession = await getServerSession(authOptions);

            if (!userSession) {
                throw new Error('user not found');
            }

            const store = await getStore(storeParams);

            if (!store) {
                throw new Error('General store not found');
            }

            const activeFinancialYear = await prisma.financialYear.findFirst({
                where: {
                    isActive: true,
                    institution: {
                        id: Number(userSession.user.institution.id),
                    },
                },
            });

            if (!activeFinancialYear) {
                throw new Error('financial year not found');
            }

            const generalStore = await prisma.storeItem.create({
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

                            Store: {
                                connect: {
                                    id: store.id,
                                },
                            },
                        },
                    },
                    storeItemHistory: {
                        create: {
                            label: `${userSession.user.name} created a new item, initial quantity was ${data.quantity}`,
                            userId: Number(userSession.user.id),
                            institutionId: Number(userSession.user.institution.id),
                            storeId: store.id,
                            financialYearId: activeFinancialYear.id,
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
                    Store: {
                        connect: {
                            id: store?.id,
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
                await prisma.storeItemNote.create({
                    data: {
                        note: data.note || '',
                        images: data.images, // Add this field only if your schema supports it
                        storeItemId: generalStore.id,
                        userId: Number(userSession.user.id),
                        institutionId: Number(userSession.user.institution.id),
                        storeId: store.id,
                    },
                });
            }
            console.log('generalStore', generalStore);
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

export const addNewSourceToStore = async (data: SourceCreateSchemaType, storeParams: StoreParams) => {
    try {
        const validateData = sourceCreateSchema.safeParse(data);
        if (validateData.success) {
            const userAccount = await getServerSession(authOptions);

            if (!userAccount) {
                throw new Error('User not found');
            }

            const store = await getStore(storeParams);

            if (!store) {
                throw new Error('General store not found');
            }

            const activeFinancialYear = await prisma.financialYear.findFirst({
                where: {
                    isActive: true,
                },
            });

            if (!activeFinancialYear) {
                throw new Error('Financial year not found');
            }

            const generalStore = await prisma.storeItem.update({
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
                            Store: {
                                connect: {
                                    id: store.id,
                                },
                            },
                        },
                    },
                    storeItemHistory: {
                        create: {
                            label: `${userAccount.user.name} added ${data.quantity} ${data.unitName} of ${data.name}`,
                            userId: Number(userAccount.user.id),
                            institutionId: Number(userAccount.user.institution.id),
                            storeId: store.id,
                            financialYearId: activeFinancialYear.id,
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
                await prisma.storeItemNote.create({
                    data: {
                        note: data.note || '',
                        images: data.images, // Add this field only if your schema supports it
                        storeItemId: generalStore.id,
                        userId: Number(userAccount.user.id),
                        institutionId: Number(userAccount.user.institution.id),
                        storeId: store.id,
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

export const addNewDistributionToStore = async (
    data: DistributionCreateSchemaType,
    id: number,
    storeParams: StoreParams
) => {
    try {
        const validateData = distributionCreateFormSchema.safeParse(data);
        if (validateData.success) {
            const userAccount = await getServerSession(authOptions);

            if (!userAccount) {
                throw new Error('User not found');
            }

            const store = await getStore(storeParams);

            if (!store) {
                throw new Error('General store not found');
            }

            const activeFinancialYear = await getActiveFinancialYear();

            if (!activeFinancialYear) {
                throw new Error('Financial year not found');
            }

            const generalStore = await prisma.storeItem.update({
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
                            Store: {
                                connect: {
                                    id: store.id,
                                },
                            },
                        },
                    },
                    financialYear: {
                        connect: {
                            id: activeFinancialYear.id,
                        },
                    },
                    storeItemHistory: {
                        create: {
                            label: `${userAccount.user.name} distributed ${data.quantity} ${data.unitName} of ${
                                data.name
                            } to ${data.personName}, ${data.department} ${data.shopName && `(${data.shopName})`}`,
                            userId: Number(userAccount.user.id),
                            institutionId: Number(userAccount.user.institution.id),
                            storeId: store.id,
                            financialYearId: activeFinancialYear.id,
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

export const createNewStoreNote = async (data: NoteCreateSchemaType, id: number, storeParams: StoreParams) => {
    try {
        const userAccount = await getServerSession(authOptions);

        const activeFinancialYear = await getActiveFinancialYear();

        if (!activeFinancialYear) {
            throw new Error('Financial year not found');
        }

        if (!userAccount) {
            throw new Error('User not found');
        }

        const store = await getStore(storeParams);

        if (!store) {
            throw new Error('General store not found');
        }

        const generalStoreNote = await prisma.storeItemNote.create({
            data: {
                note: data.note,
                images: data.images,
                storeItemId: Number(id),
                userId: Number(userAccount.user.id),
                institutionId: Number(userAccount.user.institution.id),
                storeId: store.id,
            },
        });

        await prisma.storeItem.update({
            where: {
                id: Number(id),
            },
            data: {
                storeItemHistory: {
                    create: {
                        label: `${userAccount.user.name} added a note`,
                        userId: Number(userAccount.user.id),
                        institutionId: Number(userAccount.user.institution.id),
                        storeId: store.id,
                        financialYearId: activeFinancialYear.id,
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

export const separateStoreItem = async (data: SeparateItemSchemaType, id: number, storeParams: StoreParams) => {
    try {
        const userAccount = await getServerSession(authOptions);
        const storeItem = await prisma.storeItem.findFirst({
            where: {
                id,
            },
        });

        if (!storeItem) {
            throw new Error('Store item not found');
        }

        if (!userAccount) {
            throw new Error('User not found');
        }

        const store = await getStore(storeParams);

        if (!store) {
            throw new Error('General store not found');
        }

        const activeFinancialYear = await getActiveFinancialYear();

        if (!activeFinancialYear) {
            throw new Error('Financial year not found');
        }

        const generalStore = await prisma.storeItem.create({
            data: {
                name: storeItem.name,
                alertWhenStockAmountIsLessThan: storeItem.alertWhenStockAmountIsLessThan,
                status: storeItem.status,
                unitName: storeItem.unitName,
                type: storeItem.type,
                lastUpdatedBy: {
                    connect: {
                        id: Number(userAccount.user.id),
                    },
                },
                stockAmount: Number(data.quantity),
                storageLocation: data.location,

                financialYear: {
                    connect: {
                        id: activeFinancialYear.id,
                    },
                },
                sources: {
                    create: {
                        name: storeItem.name,
                        Store: {
                            connect: {
                                id: store.id,
                            },
                        },
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
                        lastUpdatedBy: {
                            connect: {
                                id: Number(userAccount.user.id),
                            },
                        },
                        note: data.note,
                        images: data.images,
                        sourceType: 'separation',
                        brandName: data.brandName,
                        indentNo: Number(data.indentNo),
                        quantity: Number(data.quantity),
                        unitName: storeItem.unitName,
                        finalQuantity: Number(data.quantity),
                    },
                },
                institution: {
                    connect: {
                        id: Number(userAccount.user.institution.id),
                    },
                },
                Store: {
                    connect: {
                        id: store.id,
                    },
                },
            },

            include: {
                lastUpdatedBy: true,
            },
        });

        if (!generalStore) {
            throw new Error('General store create error');
        }

        await prisma.storeItem.update({
            where: {
                id,
            },
            data: {
                stockAmount: storeItem.stockAmount - Number(data.quantity),
                storeItemHistory: {
                    create: {
                        label: `${userAccount.user.name} separated ${data.quantity} ${storeItem.unitName} of ${storeItem.name} to ${data.location}`,
                        userId: Number(userAccount.user.id),
                        institutionId: Number(userAccount.user.institution.id),
                        storeId: store.id,
                        financialYearId: activeFinancialYear.id,
                    },
                },
                lastUpdatedBy: {
                    connect: {
                        id: Number(userAccount.user.id),
                    },
                },
            },
        });

        if (!generalStore) {
            throw new Error('General store create error');
        }

        return generalStore;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const updateStoreItemStatus = async (
    id: number,
    data: UpdateStoreItemStatusSchemaType,
    storeParams: StoreParams
) => {
    try {
        const userAccount = await getServerSession(authOptions);

        if (!userAccount) {
            throw new Error('User not found');
        }

        const store = await getStore(storeParams);

        if (!store) {
            throw new Error('General store not found');
        }

        const activeFinancialYear = await getActiveFinancialYear();

        if (!activeFinancialYear) {
            throw new Error('Financial year not found');
        }

        const storeItem = await prisma.storeItem.update({
            where: {
                id: id,
                lastUpdatedBy: {
                    id: Number(userAccount.user.id),
                },
            },
            data: {
                status: data.status,
                storeItemHistory: {
                    create: {
                        label: `${userAccount.user.name} updated the status of ${data.name} to ${data.status}`,
                        userId: Number(userAccount.user.id),
                        institutionId: Number(userAccount.user.institution.id),
                        storeId: store.id,
                        financialYearId: activeFinancialYear.id,
                    },
                },
            },
        });

        if (!storeItem) {
            throw new Error('Store item not found');
        }

        return storeItem;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};
