import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Sidebar from '../components/Sidebar';

const DashboardLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
    const res = await getServerSession(authOptions);

    if (!res) {
        redirect('/login');
    }
    return (
        <main className="flex w-full">
            <Sidebar />
            <div className="w-[calc(100%-240px)]">{children}</div>
        </main>
    );
};

export default DashboardLayout;
