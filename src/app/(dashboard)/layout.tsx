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
        <main className="relative flex h-svh w-full pb-20 lg:pb-0">
            <Sidebar name={res.user.name} avatar={res.user.avatar} />
            <div className="h-full w-full overflow-y-auto overflow-x-hidden lg:w-[calc(100%-240px)]">
                <Navbar name={res.user.name} avatar={res.user.avatar} />
                {children}
            </div>
        </main>
    );
};

export default DashboardLayout;
