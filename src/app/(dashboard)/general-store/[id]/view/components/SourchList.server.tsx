import prisma from '@/lib/prisma';
import PurchaseServerTable from '../../../components/PurchaseTable.server';

export const getSourchListByid = async (id: number) => {
    const response = await prisma.generalStoreSource.findMany({
        where: {
            generalStoreId: id,
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
    });

    return response;
};

type SourchListserverProps = {
    id: number;
};

const SourchListserver: React.FC<SourchListserverProps> = async ({ id }) => {
    const resposen = await getSourchListByid(id);
    return <PurchaseServerTable data={resposen} />;
};

export default SourchListserver;
