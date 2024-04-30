import prisma from '@/lib/prisma';
import HistoryTable from '../../../components/History.client';

const getHistoryByStoreItemId = async (id: number) => {
    const response = await prisma.storeItemHistory.findMany({
        where: {
            storeItemId: id,
        },
        select: {
            user: {
                select: {
                    id: true,
                    name: true,
                    department: true,
                    designation: true,
                    email: true,
                    phone: true,
                    avatar: true,
                },
            },
            label: true,
            id: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return response;
};

export type HistoryData = Awaited<ReturnType<typeof getHistoryByStoreItemId>>;

const HistoryTableServer = async ({ id }: { id: number }) => {
    const response = await getHistoryByStoreItemId(id);

    return <HistoryTable data={response} />;
};

export default HistoryTableServer;
