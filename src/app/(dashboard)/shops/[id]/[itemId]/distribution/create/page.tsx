import DistributionForm from '@/app/(dashboard)/general-store/[id]/distribution/create/components/DistributionForm';
import { getGeneralStoreItemDetails } from '@/app/(dashboard)/general-store/[id]/view/action';
import Container from '@/components/ui/Container';
import { Breadcrumb } from '@/components/ui/breadcumb';

type DistributionAddPageProps = {
    params: {
        itemId: string;
        id: string;
    };
};

const DistributeCreatePage = async ({ params }: DistributionAddPageProps) => {
    const response = await getGeneralStoreItemDetails(Number(params.itemId));

    if (response === null) {
        return <div>no found</div>;
    }

    return (
        <Container>
            <Breadcrumb items={[{ name: 'General Store', path: '/general-store' }, { name: 'Create' }]} />
            <h2 className="mt-6 text-2xl font-semibold">
                Add Distributation for <span className="text-primary">&quot;{response.name}&quot;</span>
            </h2>
            <DistributionForm
                isGeneralStore={false}
                data={{
                    name: response.name,
                    unitName: response.unitName,
                    stock: response.stockAmount,
                    storeItemId: Number(params.itemId),
                    storeId: Number(params.id),
                }}
            />
        </Container>
    );
};

export default DistributeCreatePage;
