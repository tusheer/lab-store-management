import { getServerSubdomain } from '@/app/action';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOption';
import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import ShopsTable from './components/ShopsTable';

const getShopsData = async () => {
    const subdomain = await getServerSubdomain();
    const serverSession = await getServerSession(authOptions);

    const response = await prisma.store.findMany({
        select: {
            id: true,
            name: true,
            department: {
                select: {
                    name: true,
                },
            },
            lastUpdatedBy: true,
            _count: {
                select: {
                    StoreItem: true,
                },
            },
            createdAt: true,
            updatedAt: true,
        },
        where: {
            institution: {
                subdomain,
            },
            permissions: {
                some: {
                    id: Number(serverSession?.user.id),
                },
            },
            isGeneralStore: false,
        },
    });

    return response;
};

export type Shop = Awaited<ReturnType<typeof getShopsData>>[number];

const ShopsPage = async () => {
    const shops = await getShopsData();
    return (
        <Container>
            <div className="flex justify-between">
                <PageHeading title="Shops" description="View all shop list" />
            </div>
            <ShopsTable shops={shops} />
        </Container>
    );
};

export default ShopsPage;
