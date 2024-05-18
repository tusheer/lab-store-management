import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getInstitution } from '../action';
import { authOptions } from '../api/auth/[...nextauth]/authOption';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DashboardLayout: React.FC<React.PropsWithChildren> = async ({ children, ...props }) => {
    const [session, institute] = await Promise.all([getServerSession(authOptions), getInstitution()]);
    if (!session || !institute) {
        redirect('/login');
    }

    if (session.user.institution.id !== String(institute.id)) {
        redirect('/login');
    }

    return (
        <div vaul-drawer-wrapper="" className="min-h-[100vh] bg-white">
            <main className="relative flex h-svh w-full">
                <Sidebar name={session.user.name} avatar={session.user.avatar} role={session.user.role} />
                <div className="h-full w-full overflow-y-auto overflow-x-hidden pb-20 lg:w-[calc(100%-240px)] lg:pb-0">
                    <Navbar name={session.user.name} avatar={session.user.avatar} />
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
