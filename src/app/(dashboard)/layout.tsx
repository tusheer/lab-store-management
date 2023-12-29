import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SessionProviderClient from './SessionProvider.client';

const DashboardLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
    const res = await getServerSession(authOptions);

    if (!res) {
        redirect('/login');
    }

    return (
        <SessionProviderClient>
            <main className="flex w-full">
                <Sidebar name={res.user.name} avatar={res.user.avatar}  />
                <div className="w-[calc(100%-240px)]">
                    <Navbar name={res.user.name} avatar={res.user.avatar} />
                    {children}
                </div>
            </main>
        </SessionProviderClient>
    );
};

export default DashboardLayout;
