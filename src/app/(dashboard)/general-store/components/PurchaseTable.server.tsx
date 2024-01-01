import prisma from '@/lib/prisma';
import PurchaseTable from './ItemSourceTable';

const getPurchaseData = async (id: number) => {
    const response = await prisma.generalStoreSource.findMany({
        where: {
            financialYearId: id,
        },
        select: {
            name: true,
            id: true,
            unitName: true,
            createdAt: true,
            updatedAt: true,
            brandName: true,
            intendNumber: true,
            quantity: true,
            lastUpdatedBy: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return response;
};

export type PurchaseData = Awaited<ReturnType<typeof getPurchaseData>>;

const PurchaseServerTable = async ({ activeFinancialYearId }: { activeFinancialYearId: number }) => {
    const response = await getPurchaseData(activeFinancialYearId);

    return <PurchaseTable data={response} />;
};

export default PurchaseServerTable;
