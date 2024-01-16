import prisma from '@/lib/prisma';
import HistoryTable from './History.client';

const getHistory = async () => {
    const response = await prisma.generalStoreHistory.findMany({
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

export type HistoryData = Awaited<ReturnType<typeof getHistory>>;

const HistoryServer = async () => {
    const response = await getHistory();

    return <HistoryTable data={response} />;
};

export default HistoryServer;
