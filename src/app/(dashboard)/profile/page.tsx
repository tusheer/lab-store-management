import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Container from '@/components/ui/Container';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import UpdateProfileComponent from './components/UpdateProfileComponent';

export const getMyProfile = async () => {
    const session = await getServerSession(authOptions);
    const response = await prisma.user.findUnique({
        select: {
            email: true,
            id: true,
            address: true,
            name: true,
            phone: true,
            designation: true,
            department: true,
            avatar: true,
        },
        where: {
            id: Number(session?.user.id),
        },
    });
    return response;
};

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
