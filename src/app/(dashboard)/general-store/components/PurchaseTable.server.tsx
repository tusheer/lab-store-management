import { authOptions } from '@/app/api/auth/[...nextauth]/authOption';
import prisma from '@/lib/prisma';
import { isNotNumber } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { endOfDay, formatISO, startOfDay } from 'date-fns';
import { getServerSession } from 'next-auth';
import PurchaseTable from './ItemSourceTable';

interface SearchParams {
    search?: string;
    startDate?: string;
    endDate?: string;
}

const getPurchaseData = async (id: number, generalStoreId: number, searchParams?: SearchParams) => {
    const userSession = await getServerSession(authOptions);

    if (!userSession) {
        throw Error('User not found');
    }

    // Define the base where condition with TypeScript support
    let whereConditions: Prisma.StoreItemSourceWhereInput = {
        financialYearId: id,
        institution: {
            id: Number(userSession.user.institution.id),
        },
        Store: {
            id: generalStoreId,
        },
    };

    // Add date filters if provided
    if (searchParams?.startDate || searchParams?.endDate) {
        whereConditions.createdAt = {
            ...(searchParams.startDate && {
                gte: formatISO(startOfDay(searchParams.startDate), { representation: 'complete' }),
            }),
            ...(searchParams.endDate && {
                lte: formatISO(endOfDay(searchParams.endDate), { representation: 'complete' }),
            }),
        };
    }

    // Add search filters if provided
    if (searchParams?.search) {
        const searchORConditions: Prisma.StoreItemSourceWhereInput = {
            OR: [
                { name: { contains: searchParams.search, mode: 'insensitive' } },
                { brandName: { contains: searchParams.search, mode: 'insensitive' } },
                {
                    brandName: { contains: searchParams.search, mode: 'insensitive' },
                },
                {
                    lastUpdatedBy: {
                        is: {
                            OR: [
                                { email: { contains: searchParams.search, mode: 'insensitive' } },
                                { name: { contains: searchParams.search, mode: 'insensitive' } },
                            ],
                        },
                    },
                },
                {
                    cashMemoNo: { contains: searchParams.search, mode: 'insensitive' },
                },

                {
                    cashMemoNo: { contains: searchParams.search, mode: 'insensitive' },
                },
                {
                    indentNo: {
                        equals: !isNotNumber(searchParams.search) ? Number(searchParams.search) : undefined,
                    },
                },
                {
                    id: {
                        equals: !isNaN(Number(searchParams.search)) ? Number(searchParams.search) : undefined,
                    },
                },
            ],
        };

        whereConditions = {
            ...whereConditions,
            AND: [searchORConditions],
        };
    }

    const response = await prisma.storeItemSource.findMany({
        where: whereConditions,
        select: {
            name: true,
            id: true,
            unitName: true,
            createdAt: true,
            updatedAt: true,
            brandName: true,
            indentNo: true,
            quantity: true,
            lastUpdatedBy: true,
            totalPrice: true,
            finalQuantity: true,
            purchasedAt: true,
            sourceType: true,
            cashMemoDate: true,
            cashMemoImage: true,
            cashMemoNo: true,
            financialYear: true,
            warrantyType: true,
            sellerInformation: true,
            images: true,
            note: true,
            warrantyExpireDate: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });

    return response;
};

export type PurchaseData = Awaited<ReturnType<typeof getPurchaseData>>;

const PurchaseServerTable = async ({
    activeFinancialYearId,
    generalStoreId,
    search,
    startDate,
    endDate,
}: {
    activeFinancialYearId: number;
    generalStoreId: number;
    search: string;
    startDate?: string;
    endDate?: string;
}) => {
    const response = await getPurchaseData(activeFinancialYearId, generalStoreId, { search, startDate, endDate });

    return <PurchaseTable data={response} />;
};

export default PurchaseServerTable;
