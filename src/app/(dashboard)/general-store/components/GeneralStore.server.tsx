import prisma from '@/lib/prisma';
import StockTable from './StockTable';

const getGeneralStores = async (id: number) => {
    const response = await prisma.generalStore.findMany({
        where: {
            financialYearId: id,
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
        },
    });

    return response;
};

export type GeneralStore = Awaited<ReturnType<typeof getGeneralStores>>;

const GeneralStoreServer = async ({ activeFinancialYearId }: { activeFinancialYearId: number }) => {
    const response = await getGeneralStores(activeFinancialYearId);

    return <StockTable data={response} />;
};

export default GeneralStoreServer;
