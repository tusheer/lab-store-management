import prisma from '@/lib/prisma';
import { isNotNumber } from '@/lib/utils';
import { endOfDay, formatISO, startOfDay } from 'date-fns';
import PurchaseTable from './ItemSourceTable';

interface SearchParams {
    search?: string;
    startDate?: string;
    endDate?: string;
}

const getPurchaseData = async (id: number, searchParams?: SearchParams) => {
    const response = await prisma.generalStoreSource.findMany({
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
                              { brandName: { contains: searchParams.search, mode: 'insensitive' } },
                              {
                                  brandName: { contains: searchParams.search, mode: 'insensitive' },
                              },

                              {
                                  lastUpdatedBy: {
                                      email: { contains: searchParams.search, mode: 'insensitive' },
                                      name: { contains: searchParams.search, mode: 'insensitive' },
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
                                      equals: !isNotNumber(searchParams.search)
                                          ? Number(searchParams.search)
                                          : undefined,
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
    search,
    startDate,
    endDate,
}: {
    activeFinancialYearId: number;
    search: string;
    startDate?: string;
    endDate?: string;
}) => {
    const response = await getPurchaseData(activeFinancialYearId, { search, startDate, endDate });

    return <PurchaseTable data={response} />;
};

export default PurchaseServerTable;
