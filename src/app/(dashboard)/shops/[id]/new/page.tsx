import CreateItemForm from '@/app/(dashboard)/general-store/components/CreateItemForm';
import Container from '@/components/ui/Container';

const CreateGeneralStoreItemPage: React.FC<{
    params: {
        id: string;
    };
}> = ({ params }) => {
    return (
        <Container>
            <CreateItemForm isGeneralStore={false} id={Number(params.id)} />
        </Container>
    );
};

export default CreateGeneralStoreItemPage;
