import prisma from '@/lib/prisma';
import { isNotNumber } from '@/lib/utils';
import { endOfDay, formatISO, startOfDay } from 'date-fns';
import GeneralStoreTable from './GeneralStoreTable';

interface SearchParams {
    search?: string;
    startDate?: string;
    endDate?: string;
}

const getGeneralStores = async (id: number, searchParams?: SearchParams) => {
    const response = await prisma.generalStore.findMany({
        where: {
            financialYearId: id,
            ...((searchParams?.startDate || searchParams?.endDate) && {
                createdAt: {
                    ...(searchParams.startDate && {
                        gte: formatISO(startOfDay(searchParams.startDate), { representation: 'complete' }) || undefined,
                    }),
                    ...(searchParams.endDate && {
                        lte: formatISO(endOfDay(searchParams.endDate), { representation: 'complete' }) || undefined,
                    }),
                },
            }),
            AND: searchParams?.search
                ? [
                      {
                          OR: [
                              { name: { contains: searchParams.search, mode: 'insensitive' } },

                              {
                                  lastUpdatedBy: {
                                      email: { contains: searchParams.search, mode: 'insensitive' },
                                      name: { contains: searchParams.search, mode: 'insensitive' },
                                  },
                              },

                              {
                                  id: {
                                      equals: !isNotNumber(searchParams.search)
                                          ? Number(searchParams.search)
                                          : undefined,
                                  },
                              },
                          ],
                      },
                  ]
                : undefined,
        },
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
            createdAt: 'desc',
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
