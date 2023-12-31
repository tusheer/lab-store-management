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
    return <ItemSourceTable data={resposen} />;
};

export default SourchListserver;
