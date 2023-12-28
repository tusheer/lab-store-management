import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { Box } from 'lucide-react';
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
                <div className="mt-10 flex flex-col items-center justify-center gap-4">
                    <Box size={100} color="gray" strokeWidth={1} />
                    <h4 className="text-xl font-medium text-gray-500"> No active financial year found</h4>
                    <Link className="" href={{ pathname: '/financial-year', query: { modal: true } }}>
                        <Button className="px-5 py-5">Add a new financial year</Button>
                    </Link>
                </div>
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
