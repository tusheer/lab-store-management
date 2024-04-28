import prisma from '@/lib/prisma';

import DistributionTable from './DistributionTable';

const getDistributionData = async (id: number) => {
    const response = await prisma.storeItemDistribution.findMany({
        where: {
            storeItemId: id,
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
            updatedAt: 'desc',
        },
    });

    return response;
};

export type DistributionData = Awaited<ReturnType<typeof getDistributionData>>;

const DistributionTableServer = async ({ id }: { id: number }) => {
    const response = await getDistributionData(id);
    return <DistributionTable data={response} />;
};

export default DistributionTableServer;
