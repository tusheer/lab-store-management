import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/authOption';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DashboardLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
    const res = await getServerSession(authOptions);

    if (!res) {
        redirect('/login');
    }

    return (
        <div vaul-drawer-wrapper="" className="min-h-[100vh] bg-white">
            <main className="relative flex h-svh w-full">
                <Sidebar name={res.user.name} avatar={res.user.avatar} />
                <div className="h-full w-full overflow-y-auto overflow-x-hidden pb-20 lg:w-[calc(100%-240px)] lg:pb-0">
                    <Navbar name={res.user.name} avatar={res.user.avatar} />
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
