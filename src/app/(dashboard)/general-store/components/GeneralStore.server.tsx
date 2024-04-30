import { authOptions } from '@/app/api/auth/[...nextauth]/authOption';
import prisma from '@/lib/prisma';
import { ItemType, MachineStatus, Prisma } from '@prisma/client';
import { endOfDay, formatISO, startOfDay } from 'date-fns';
import { getServerSession } from 'next-auth';
import GeneralStoreTable from './GeneralStoreTable';

interface SearchParams {
    search?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
    status?: string;
}

const getGeneralStoreItems = async (id: number, generalStoreId: number, searchParams?: SearchParams) => {
    const userSession = await getServerSession(authOptions);

    if (!userSession) {
        throw Error('User not found');
    }

    // Define the base where condition with TypeScript support
    let whereConditions: Prisma.StoreItemWhereInput = {
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
        const searchORConditions: Prisma.StoreItemWhereInput = {
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

    if (searchParams?.status) {
        whereConditions.status = searchParams.status as MachineStatus;
    }

    if (searchParams?.type) {
        whereConditions.type = searchParams.type as ItemType;
    }

    const response = await prisma.storeItem.findMany({
        where: whereConditions,
        select: {
            lastUpdatedBy: true,
            name: true,
            id: true,
            stockAmount: true,
            unitName: true,
            createdAt: true,
            updatedAt: true,
            type: true,
            status: true,
            alertWhenStockAmountIsLessThan: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });

    return response;
};
export type GeneralStoreItem = Awaited<ReturnType<typeof getGeneralStoreItems>>;

const GeneralStoreServer = async ({
    generalStoreId,
    activeFinancialYearId,
    search,
    startDate,
    endDate,
    status,
    type,
}: {
    activeFinancialYearId: number;
    generalStoreId: number;
    search: string;
    startDate: string;
    endDate: string;
    type: string;
    status: string;
}) => {
    const response = await getGeneralStoreItems(activeFinancialYearId, generalStoreId, {
        endDate,
        search,
        startDate,
        status,
        type,
    });

    return <GeneralStoreTable data={response} />;
};

export default GeneralStoreServer;
