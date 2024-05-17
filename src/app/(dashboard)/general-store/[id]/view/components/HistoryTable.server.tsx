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

    const formattedResponse = response.map((item) => ({
        ...item,
        storeItem: {
            id: 0, // Replace with the actual store item ID
            name: '', // Replace with the actual store item name
            storageLocation: null, // Replace with the actual store item storage location
        },
    }));

    return (
        <HistoryTable
            data={{
                currentPage: 1,
                items: formattedResponse || [],
                totalItems: formattedResponse.length,
                totalPages: 1,
            }}
        />
    );
};

export default HistoryTableServer;
