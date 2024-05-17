import { authOptions } from '@/app/api/auth/[...nextauth]/authOption';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { endOfDay, formatISO, startOfDay } from 'date-fns';
import { getServerSession } from 'next-auth';
import HistoryTable from './History.client';

interface SearchParams {
    search?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
    status?: string;
    page?: string;
}

const getHistory = async (financialYearId: number, generalStoreId: number, searchParams?: SearchParams) => {
    const userSession = await getServerSession(authOptions);

    if (!userSession) {
        throw Error('User not found');
    }

    // Define the base where condition with TypeScript support
    let whereConditions: Prisma.StoreItemHistoryWhereInput = {
        institution: {
            id: Number(userSession.user.institution.id),
        },
        Store: {
            id: generalStoreId,
        },
        financialYearId,
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
        const searchORConditions: Prisma.StoreItemHistoryWhereInput = {
            OR: [
                {
                    id: {
                        equals: !isNaN(Number(searchParams.search)) ? Number(searchParams.search) : undefined,
                    },
                },
                {
                    id: {
                        equals: !isNaN(Number(searchParams.search)) ? Number(searchParams.search) : undefined,
                    },
                },
                {
                    storeItem: {
                        OR: [
                            { name: { contains: searchParams.search, mode: 'insensitive' } },
                            { storageLocation: { contains: searchParams.search, mode: 'insensitive' } },
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
                        ],
                    },
                },
            ],
        };

        whereConditions = {
            ...whereConditions,
            AND: [searchORConditions],
        };
    }

    const pageNumber = Number(searchParams?.page || 1);
    const pageSize = 10;
    const skip = (pageNumber - 1) * pageSize;

    const [items, totalItems] = await Promise.all([
        prisma.storeItemHistory.findMany({
            where: whereConditions,
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        department: true,
                        designation: true,
                        email: true,
                        phone: true,
                        avatar: true,
                    },
                },
                label: true,
                id: true,
                storeItem: {
                    select: {
                        id: true,
                        name: true,
                        storageLocation: true,
                    },
                },
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: pageSize,
        }),
        prisma.storeItemHistory.count({
            where: whereConditions,
        }),
    ]);

    return { items, totalItems, currentPage: pageNumber, totalPages: Math.ceil(totalItems / pageSize) };
};

export type HistoryData = Awaited<ReturnType<typeof getHistory>>;

interface HistoryServerProps {
    financialYearId: number;
    generalStoreId: number;
    searchParams?: SearchParams;
}

const HistoryServer: React.FC<HistoryServerProps> = async ({ financialYearId, generalStoreId, searchParams }) => {
    const response = await getHistory(financialYearId, generalStoreId, searchParams);
    return <HistoryTable data={response} />;
};

export default HistoryServer;
