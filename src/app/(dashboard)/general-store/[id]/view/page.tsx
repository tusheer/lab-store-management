import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import prisma from '@/lib/prisma';
import { Suspense } from 'react';
import GeneralStoreItemDetailsCard from './components/DetailsCard';
import SourchListserver from './components/SourchList.server';
import StoreDetailsTab from './components/Tab';

export const getItemDetails = async (id: number) => {
    const response = await prisma.generalStore.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        select: {
            financialYear: {
                select: {
                    name: true,
                    id: true,
                    isActive: true,
                },
            },
            unitName: true,
            alertWhenStockAmountIsLessThan: true,
            name: true,
            stockAmount: true,
            type: true,
            storageLocation: true,
            id: true,
            lastUpdatedBy: true,
            status: true,
            _count: {
                select: {
                    sources: true,
                    distributions: true,
                    generalStoreNotes: true,
                },
            },
        },
    });

    return response;
};

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
