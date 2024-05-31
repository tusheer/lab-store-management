import { getGeneralStoreDetails } from '@/app/(dashboard)/general-store/[id]/view/action';
import GeneralStoreItemDetailsCard from '@/app/(dashboard)/general-store/[id]/view/components/DetailsCard';
import DistributionTableServer from '@/app/(dashboard)/general-store/[id]/view/components/DistributionTable.server';
import HistoryTableServer from '@/app/(dashboard)/general-store/[id]/view/components/HistoryTable.server';
import NoteCardServer from '@/app/(dashboard)/general-store/[id]/view/components/NoteCard.server';
import SourchListserver from '@/app/(dashboard)/general-store/[id]/view/components/SourchList.server';
import StoreDetailsTab from '@/app/(dashboard)/general-store/[id]/view/components/Tab';
import LoaderSpinner from '@/app/components/LoaderSpinner';
import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Suspense } from 'react';

export type GeneralStoreItemDetails = Awaited<ReturnType<typeof getGeneralStoreDetails>>;

type StoreDetailsPageProps = {
    params: {
        itemId: string;
    };
    searchParams: {
        tab: string;
    };
};

const StoreDetailsPage = async ({ params, searchParams }: StoreDetailsPageProps) => {
    // ??If fianancialyear isnot active then will veiw different view

    const data = await getGeneralStoreDetails(Number(params.itemId));

    if (data === null) {
        return <div>no found</div>;
    }

    const tab = searchParams.tab || 'details';

    return (
        <Container>
            {data.alertWhenStockAmountIsLessThan !== null && data.alertWhenStockAmountIsLessThan > data.stockAmount && (
                <Alert variant="destructive" className="mb-6">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>
                        <span className="font-semibold">Alert!</span> {data.name} stock is less than{' '}
                        {data.alertWhenStockAmountIsLessThan} {data.unitName}
                    </AlertTitle>
                    <AlertDescription>
                        Please add more {data.name} to the stock. Otherwise, you will not be able to distribute it.
                    </AlertDescription>
                </Alert>
            )}

            <PageHeading title={`Store item details | ${data?.financialYear.name}`} />
            <StoreDetailsTab />
            {tab === 'details' && (
                <Suspense fallback={<LoaderSpinner />}>
                    <GeneralStoreItemDetailsCard data={data} />
                </Suspense>
            )}
            {tab === 'notes' && (
                <Suspense fallback={<LoaderSpinner />}>
                    <NoteCardServer id={data.id} />
                </Suspense>
            )}
            {tab === 'source' && (
                <Suspense fallback={<LoaderSpinner />}>
                    <SourchListserver id={Number(params.itemId)} />
                </Suspense>
            )}
            {tab === 'distribution' && (
                <Suspense fallback={<LoaderSpinner />}>
                    <DistributionTableServer id={Number(params.itemId)} />
                </Suspense>
            )}
            {tab === 'history' && (
                <Suspense fallback={<LoaderSpinner />}>
                    <HistoryTableServer id={Number(params.itemId)} />
                </Suspense>
            )}
        </Container>
    );
};

export default StoreDetailsPage;
