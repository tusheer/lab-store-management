import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import prisma from '@/lib/prisma';
import Link from 'next/link';
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
                    id: true,
                    name: true,
                    unitName: true,
                    lastUpdatedBy: true,
                    updatedAt: true,
                    createdAt: true,
                    type: true,
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
                <Link
                    className="block w-fit rounded-md bg-black px-3 py-3 text-white"
                    href={{ pathname: '/financial-year', query: { modal: true } }}
                >
                    Add a new financial year
                </Link>
            </Container>
        );
    }

    return (
        <Container>
            <PageHeading
                title={`General store - ${gerelStores.name}`}
                description="Veiw all general store stock item"
            />
            <StockTable data={gerelStores.data} />
        </Container>
    );
};

export default GeneralStores;
