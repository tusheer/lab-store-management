import Container from '@/components/ui/Container';
import { getMyProfile } from './action';
import UpdateProfileComponent from './components/UpdateProfileComponent';

export type Profile = Awaited<ReturnType<typeof getMyProfile>>;

const ProfilePage = async () => {
    const data = await getMyProfile();

    if (data === null) {
        return null;
    }
    return (
        <Container>
            <UpdateProfileComponent data={data} />
        </Container>
    );
};

export default ProfilePage;
