import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import StockTable from './components/StockTable';

export async function getGeneralStores() {
    const activeFinancialYear = await prisma.financialYear.findFirst({
        where: {
            isActive: true,
            GeneralStore: {
                every: {
                    isDeleted: false,
                },
            },
        },
        select: {
            name: true,
            GeneralStore: {
                where: {
                    isDeleted: false,
                },
                select: {
                    name: true,
                    id: true,
                },
            },
            id: true,
        },
    });

    if (activeFinancialYear === null) {
        return null;
    }

    return {
        name: activeFinancialYear.name,
        data: activeFinancialYear.GeneralStore,
    };
}

export type GeneralStore = Awaited<ReturnType<typeof getGeneralStores>>;

const GeneralStores = async () => {
    const gerelStores = await getGeneralStores();

    if (gerelStores === null) {
        return (
            <Container>
                No active financial year found
                <Button>Add new financial year</Button>
            </Container>
        );
    }

    return (
        <div>
            <PageHeading
                title={`General store - ${gerelStores.name}`}
                description="Veiw all general store stock item"
            />
            <StockTable data={gerelStores.data} />
        </div>
    );
};

export default GeneralStores;
