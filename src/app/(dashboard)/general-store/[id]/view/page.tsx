import LoaderSpinner from '@/app/components/LoaderSpinner';
import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Suspense } from 'react';
import { getGeneralStoreDetails } from './action';
import GeneralStoreItemDetailsCard from './components/DetailsCard';
import DistributionTableServer from './components/DistributionTable.server';
import NoteCardServer from './components/NoteCard.server';
import SourchListserver from './components/SourchList.server';
import StoreDetailsTab from './components/Tab';

export type GeneralStoreItemDetails = Awaited<ReturnType<typeof getGeneralStoreDetails>>;

type StoreDetailsPageProps = {
    params: {
        id: string;
    };
    searchParams: {
        tab: string;
    };
};

const StoreDetailsPage = async ({ params, searchParams }: StoreDetailsPageProps) => {
    // ??If fianancialyear isnot active then will veiw different view

    const data = await getGeneralStoreDetails(Number(params.id));

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
                <Suspense fallback={<div>Loading</div>}>
                    <SourchListserver id={Number(params.id)} />
                </Suspense>
            )}
            {tab === 'distribution' && (
                <Suspense fallback={<div>Loading</div>}>
                    <DistributionTableServer id={Number(params.id)} />
                </Suspense>
            )}
        </Container>
    );
};

export default StoreDetailsPage;
