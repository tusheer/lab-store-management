import { roleBasedRedirect } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/authOption';
import { UserAuthForm } from './components/AuthForm';

const Liginpage = async () => {
    const userSession = await getServerSession(authOptions);

    if (userSession?.user) {
        const redirectUrl = roleBasedRedirect(userSession.user.role);
        console.log('redirectUrl', redirectUrl);
        return redirect(redirectUrl);
    }

    return (
        <>
            <div className="relative flex h-svh items-center justify-center lg:px-0">
                <div className="relative hidden h-full w-[400px] flex-shrink-0 flex-col bg-muted p-6 text-white dark:border-r lg:flex">
                    <div className="absolute inset-0 bg-primary" />
                    <div className="relative z-20 flex h-full flex-col items-center justify-center gap-4 text-lg font-medium">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            height={100}
                            width={100}
                            src="https://cumillapoly.gov.bd/wp-content/uploads/elementor/thumbs/300521_02_59_10-pw3wkuctbqgomd0rbugx0zkr2bqfu9m3bbalucmo0w.png"
                            alt="Comilla polytechnic institute"
                        />
                        <h1 className="text-center text-3xl font-semibold">Comilla polytechnic institute</h1>
                    </div>
                </div>
                <div className="w-full lg:p-3">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">Login to your account</h1>
                            <p className="text-sm text-muted-foreground">
                                To access your dashboard, you need to be logged in.
                            </p>
                        </div>
                        <UserAuthForm />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Liginpage;
