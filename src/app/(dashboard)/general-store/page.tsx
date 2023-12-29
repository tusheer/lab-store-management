import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { Box, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import GeneralStoreServer from './components/GeneralStore.server';
import GeneralStoreTab from './components/GeneralStoreTab';
import PurchaseServerTable from './components/PurchaseTable.server';

export async function getGeneralStores() {
    const activeFinancialYear = await prisma.financialYear.findFirst({
        where: {
            isActive: true,
        },
    });

    if (activeFinancialYear === null) {
        return null;
    }

    return {
        name: activeFinancialYear.name,
        id: activeFinancialYear.id,
    };
}

const GeneralStores = async ({ searchParams }: { searchParams: { tab: string } }) => {
    const gerelStores = await getGeneralStores();

    const tab = searchParams.tab || 'stock';

    if (gerelStores === null) {
        return (
            <Container>
                <div className="mt-10 flex flex-col items-center justify-center gap-4">
                    <Box size={100} color="gray" strokeWidth={0.7} />
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
            <div className="flex justify-between">
                <PageHeading title={`General store - ${gerelStores.name}`} />
                <Link href="/general-store/new">
                    <Button>Add new item</Button>
                </Link>
            </div>
            <GeneralStoreTab />

            {tab === 'stock' && (
                <Suspense
                    fallback={
                        <div className="mt-24 flex flex-col items-center justify-center gap-4">
                            <Loader2 size={70} strokeWidth={1} className="animate-spin text-primary" />
                        </div>
                    }
                >
                    <GeneralStoreServer activeFinancialYearId={gerelStores.id} />
                </Suspense>
            )}
            {tab === 'purchase' && (
                <Suspense
                    fallback={
                        <div className="mt-24 flex flex-col items-center justify-center gap-4">
                            <Loader2 size={70} strokeWidth={1} className="animate-spin text-primary" />
                        </div>
                    }
                >
                    <PurchaseServerTable activeFinancialYearId={gerelStores.id} />
                </Suspense>
            )}
        </Container>
    );
};

export default GeneralStores;
