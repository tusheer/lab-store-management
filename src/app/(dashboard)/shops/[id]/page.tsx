import { getActiveFinancialYear } from '@/app/action';
import LoaderSpinner from '@/app/components/LoaderSpinner';
import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import { Button } from '@/components/ui/button';
import { Box } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { getStore } from '../../general-store/actions';
import DistributionTableServer from '../../general-store/components/DistributionTable.server';
import GeneralStoreServer from '../../general-store/components/GeneralStore.server';
import GeneralStoreTab from '../../general-store/components/GeneralStoreTab';
import HistoryServer from '../../general-store/components/History.server';
import PurchaseServerTable from '../../general-store/components/PurchaseTable.server';

const ShopStorePage = async ({
    searchParams,
    params,
}: {
    searchParams: {
        tab: string;
        search: string;
        startDate: string;
        endDate: string;
        type: string;
        status: string;
        page: string;
    };
    params: {
        id: string;
    };
}) => {
    const [activeFinancialyear, generalStore] = await Promise.all([
        getActiveFinancialYear(),
        getStore({ id: Number(params.id) }),
    ]);
    const tab = searchParams.tab || 'stock';
    if (!activeFinancialyear) {
        return (
            <Container>
                <div className="mt-10 flex flex-col items-center justify-center gap-4">
                    <Box size={100} color="gray" strokeWidth={0.7} />
                    <h4 className="text-xl font-medium text-gray-500"> No active financial year found</h4>
                </div>
            </Container>
        );
    }

    if (!generalStore) {
        return (
            <Container>
                <div className="mt-10 flex flex-col items-center justify-center gap-4">
                    <Box size={100} color="gray" strokeWidth={0.7} />
                    <h4 className="text-xl font-medium text-gray-500">Store not created yet</h4>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="flex  items-center justify-between lg:flex-row lg:items-start">
                <PageHeading title={`${activeFinancialyear.name}`} />
                <Link href={`/shops/${params.id}/new`} className="hidden lg:block">
                    <Button>Add new item</Button>
                </Link>
                <Link href={`/shops/${params.id}/new`} className="fixed bottom-[76px] right-7 z-30 block lg:hidden">
                    <div className="rounded-full bg-primary px-3 py-3 text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#fff"
                            className="h-5 w-5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                </Link>
            </div>
            <GeneralStoreTab id={Number(params.id)} />
            {tab === 'stock' && (
                <Suspense fallback={<LoaderSpinner />}>
                    <GeneralStoreServer
                        id={Number(params.id)}
                        isGeneralStore={false}
                        generalStoreId={generalStore?.id}
                        searchParams={searchParams}
                        activeFinancialYearId={activeFinancialyear.id}
                    />
                </Suspense>
            )}
            {tab === 'source' && (
                <Suspense fallback={<LoaderSpinner />}>
                    <PurchaseServerTable
                        generalStoreId={generalStore?.id}
                        search={searchParams.search}
                        activeFinancialYearId={activeFinancialyear.id}
                        startDate={searchParams.startDate}
                        endDate={searchParams.endDate}
                    />
                </Suspense>
            )}
            {tab === 'distribution' && (
                <Suspense fallback={<LoaderSpinner />}>
                    <DistributionTableServer
                        generalStoreId={generalStore?.id}
                        search={searchParams.search}
                        activeFinancialYearId={activeFinancialyear.id}
                        startDate={searchParams.startDate}
                        endDate={searchParams.endDate}
                    />
                </Suspense>
            )}
            {tab === 'history' && (
                <Suspense fallback={<LoaderSpinner />}>
                    <HistoryServer
                        generalStoreId={generalStore?.id}
                        searchParams={searchParams}
                        financialYearId={activeFinancialyear.id}
                    />
                </Suspense>
            )}
        </Container>
    );
};

export default ShopStorePage;
