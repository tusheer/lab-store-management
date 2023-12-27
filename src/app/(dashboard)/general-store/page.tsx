import prisma from '@/lib/prisma';
import StockTable from './components/StockTable';

export async function getGeneralStores() {
    const generalStores = await prisma.generalStore.findMany({
        select: {
            id: true,
            unitName: true,
            createdAt: true,
            updatedAt: true,
            stockAmount: true,
            alertWhenStockAmountIsLessThan: true,
            lastUpdatedBy: true,
            productName: true,
            generalStoreNotes: true,
        },
        where: {
            isDeleted: false,
        },
    });

    return generalStores;
}

export type GeneralStore = Awaited<ReturnType<typeof getGeneralStores>>[0];

const GeneralStores = async () => {
    const gerelStores = await getGeneralStores();

    return (
        <div>
            <StockTable data={gerelStores} />
        </div>
    );
};

export default GeneralStores;
