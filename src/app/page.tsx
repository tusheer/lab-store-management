import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/authOption';

export default async function Home() {
    const userSession = await getServerSession(authOptions);
    if (userSession?.user) {
        return redirect('/general-store');
    }

    return redirect('/login');
}
