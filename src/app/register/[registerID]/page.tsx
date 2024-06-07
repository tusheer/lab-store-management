import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import RegisterPasswordForm from '../components/RegisterPasswordForm';

const page = async ({ params }: { params: { registerID: string } }) => {
    const res = await prisma.user.findUnique({
        where: {
            registerID: params.registerID,
        },
        select: {
            email: true,
        },
    });
    if (!res?.email) {
        redirect('/login');
    }
    return (
        <div className="relative flex h-svh items-center justify-center lg:px-0">
            <div className="w-full">
                <div className="mx-auto flex w-full max-w-2xl flex-col justify-center space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Set your password</h1>
                        <p className="text-sm text-muted-foreground">To acsses your account</p>
                    </div>
                    <RegisterPasswordForm registerID={params.registerID} email={res.email} />
                </div>
            </div>
        </div>
    );
};

export default page;
