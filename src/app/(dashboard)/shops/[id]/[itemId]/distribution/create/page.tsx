import { getGeneralStoreDetails } from '@/app/(dashboard)/general-store/[id]/view/action';
import Container from '@/components/ui/Container';
import { Breadcrumb } from '@/components/ui/breadcumb';
import DistributionForm from './components/DistributionForm';

type DistributionAddPageProps = {
    params: {
        id: string;
    };
};

const DistributeCreatePage = async ({ params }: DistributionAddPageProps) => {
    const response = await getGeneralStoreDetails(Number(params.id));

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

export default DistributeCreatePage;
