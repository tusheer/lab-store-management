import Container from '@/components/ui/Container';
import CreateItemForm from '../components/CreateItemForm';

const CreateGeneralStoreItemPage = () => {
    return (
        <Container>
            <CreateItemForm isGeneralStore />
        </Container>
    );
};

export default CreateGeneralStoreItemPage;
