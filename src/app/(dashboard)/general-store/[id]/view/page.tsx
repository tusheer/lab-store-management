import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import { Suspense } from 'react';
import { getItemDetails } from './action';
import GeneralStoreItemDetailsCard from './components/DetailsCard';
import SourchListserver from './components/SourchList.server';
import StoreDetailsTab from './components/Tab';

export type GeneralStoreItemDetails = Awaited<ReturnType<typeof getItemDetails>>;

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

    const data = await getItemDetails(Number(params.id));

    if (data === null) {
        return <div>no found</div>;
    }

    const tab = searchParams.tab || 'details';

    return (
        <Container>
            <PageHeading title={`Store item details | ${data?.financialYear.name}`} />
            <StoreDetailsTab />
            {tab === 'details' && <GeneralStoreItemDetailsCard data={data} />}
            {tab === 'source' && (
                <Suspense fallback={<div>Loading</div>}>
                    <SourchListserver id={Number(params.id)} />
                </Suspense>
            )}
        </Container>
    );
};

export default StoreDetailsPage;
