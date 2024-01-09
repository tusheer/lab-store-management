import prisma from '@/lib/prisma';
import { isNotNumber } from '@/lib/utils';
import { endOfDay, formatISO, startOfDay } from 'date-fns';
import DistributionTable from './DistributionTable';
interface SearchParams {
    search?: string;
    startDate?: string;
    endDate?: string;
}
const getDistributionData = async (id: number, searchParams?: SearchParams) => {
    const response = await prisma.generalStoreDistribution.findMany({
        where: {
            financialYearId: id,
            ...((searchParams?.startDate || searchParams?.endDate) && {
                updatedAt: {
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
            finalQuantity: true,
            unitName: true,
            createdAt: true,
            updatedAt: true,
            allocatedAt: true,
            department: true,
            shopName: true,
            personName: true,
            quantity: true,
            images: true,
            note: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return response;
};

export type DistributionData = Awaited<ReturnType<typeof getDistributionData>>;

const DistributionTableServer = async ({
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
    const response = await getDistributionData(activeFinancialYearId, {
        search,
        startDate,
        endDate,
    });
    return <DistributionTable data={response} />;
};

export default DistributionTableServer;
