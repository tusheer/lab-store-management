import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { endOfDay, formatISO, startOfDay } from 'date-fns';
import GeneralStoreTable from './GeneralStoreTable';

interface SearchParams {
    search?: string;
    startDate?: string;
    endDate?: string;
}

const getGeneralStores = async (id: number, searchParams?: SearchParams) => {
    // Define the base where condition with TypeScript support
    let whereConditions: Prisma.GeneralStoreWhereInput = {
        financialYearId: id,
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
        const searchORConditions: Prisma.GeneralStoreWhereInput = {
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

    const response = await prisma.generalStore.findMany({
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
export type GeneralStore = Awaited<ReturnType<typeof getGeneralStores>>;

const GeneralStoreServer = async ({
    activeFinancialYearId,
    search,
    startDate,
    endDate,
}: {
    activeFinancialYearId: number;
    search: string;
    startDate: string;
    endDate: string;
}) => {
    const response = await getGeneralStores(activeFinancialYearId, {
        endDate,
        search,
        startDate,
    });

    return <GeneralStoreTable data={response} />;
};

export default GeneralStoreServer;
