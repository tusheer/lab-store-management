import Link from 'next/link';
import { UserAuthForm } from './components/AuthForm';

const Liginpage = () => {
    return (
        <>
            <div className="relative flex h-svh  items-center justify-center lg:px-0">
                <div className="relative hidden h-full w-[400px] flex-shrink-0 flex-col bg-muted p-6 text-white lg:flex dark:border-r">
                    <div className="absolute inset-0 bg-zinc-900" />
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
                <div className="w-full lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">Login to your account</h1>
                            <p className="text-sm text-muted-foreground">
                                To access your dashboard, you need to be logged in.
                            </p>
                        </div>
                        <UserAuthForm />
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            By clicking continue, you agree to our{' '}
                            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Liginpage;
