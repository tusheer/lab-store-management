import { getActiveFinancialYear } from '@/app/action';
import LoaderSpinner from '@/app/components/LoaderSpinner';
import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import { Button } from '@/components/ui/button';
import { Box } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import DistributionTableServer from './components/DistributionTable.server';
import GeneralStoreServer from './components/GeneralStore.server';
import GeneralStoreTab from './components/GeneralStoreTab';
import PurchaseServerTable from './components/PurchaseTable.server';

const GeneralStores = async ({ searchParams }: { searchParams: { tab: string } }) => {
    const activeFinancialyear = await getActiveFinancialYear();
    const tab = searchParams.tab || 'stock';

    if (!activeFinancialyear) {
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
            <div className="flex items-center justify-between lg:items-start">
                <PageHeading title={`General store - ${activeFinancialyear.name}`} />
                <Link href="/general-store/new">
                    <Button>Add new item</Button>
                </Link>
            </div>
            <GeneralStoreTab />
            {tab === 'stock' && (
                <Suspense fallback={<LoaderSpinner />}>
                    <GeneralStoreServer activeFinancialYearId={activeFinancialyear.id} />
                </Suspense>
            )}
            {tab === 'source' && (
                <Suspense fallback={<LoaderSpinner />}>
                    <PurchaseServerTable activeFinancialYearId={activeFinancialyear.id} />
                </Suspense>
            )}
            {tab === 'distribution' && (
                <Suspense fallback={<LoaderSpinner />}>
                    <DistributionTableServer activeFinancialYearId={activeFinancialyear.id} />
                </Suspense>
            )}
        </Container>
    );
};

export default GeneralStores;
