import SourceForm from '@/app/(dashboard)/general-store/[id]/source/create/components/SourceForm';
import { getGeneralStoreItemDetails } from '@/app/(dashboard)/general-store/[id]/view/action';
import Container from '@/components/ui/Container';
import { Breadcrumb } from '@/components/ui/breadcumb';

type DistributionAddPageProps = {
    params: {
        itemId: string;
    };
};

const SourceCreatePage = async ({ params }: DistributionAddPageProps) => {
    const response = await getGeneralStoreItemDetails(Number(params.itemId));

    if (response === null) {
        return <div>no found</div>;
    }

    return (
        <Container>
            <Breadcrumb items={[{ name: 'General Store', path: '/general-store' }, { name: 'Create' }]} />
            <h2 className="mt-6 text-2xl font-semibold">
                Add source to <span className="text-primary">&quot;{response.name}&quot;</span>
            </h2>
            <SourceForm
                data={{
                    storeId: response.id,
                    name: response.name,
                    unitName: response.unitName,
                    stock: response.stockAmount,
                }}
            />
        </Container>
    );
};

export default SourceCreatePage;
