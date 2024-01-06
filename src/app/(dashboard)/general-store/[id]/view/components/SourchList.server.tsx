import prisma from '@/lib/prisma';
import ItemSourceTable from '../../../components/ItemSourceTable';

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
            indentNo: true,
            quantity: true,
            lastUpdatedBy: true,
            totalPrice: true,
            finalQuantity: true,
            purchasedAt: true,
            sourceType: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return response;
};

type SourchListserverProps = {
    id: number;
};

const SourchListserver: React.FC<SourchListserverProps> = async ({ id }) => {
    const resposen = await getSourchListByid(id);
    return <ItemSourceTable data={resposen} />;
};

export default SourchListserver;
