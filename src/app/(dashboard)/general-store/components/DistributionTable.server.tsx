import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { endOfDay, formatISO, startOfDay } from 'date-fns';
import DistributionTable from './DistributionTable';
interface SearchParams {
    search?: string;
    startDate?: string;
    endDate?: string;
}
const getDistributionData = async (id: number, searchParams?: SearchParams) => {
    // Define the base where condition with TypeScript support
    let whereConditions: Prisma.GeneralStoreDistributionWhereInput = {
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
        const searchORConditions: Prisma.GeneralStoreDistributionWhereInput = {
            OR: [
                { name: { contains: searchParams.search, mode: 'insensitive' } },
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
    const response = await prisma.generalStoreDistribution.findMany({
        where: whereConditions,
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
            updatedAt: 'desc',
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
