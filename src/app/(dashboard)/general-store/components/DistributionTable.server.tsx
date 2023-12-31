import prisma from '@/lib/prisma';
import DistributionTable from './DistributionTable';

const getDistributionData = async (id: number) => {
    const response = await prisma.generalStoreDistribution.findMany({
        where: {
            financialYearId: id,
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
    });

    return response;
};

export type DistributionData = Awaited<ReturnType<typeof getDistributionData>>;

const DistributionTableServer = async ({ activeFinancialYearId }: { activeFinancialYearId: number }) => {
    const response = await getDistributionData(activeFinancialYearId);
    return <DistributionTable data={response} />;
};

export default DistributionTableServer;
