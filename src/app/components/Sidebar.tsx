'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, isRouterPathnameMatched } from '@/lib/utils';
import { LineChart, Microscope, School, Store } from 'lucide-react';
import { useSession } from 'next-auth/react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
    {
        icon: Store,
        name: 'General Store',
        link: '/general-store',
        exact: false,
    },
    {
        icon: LineChart,
        name: 'Financial Year',
        link: '/financial-year',
        exact: false,
    },
    {
        icon: School,
        name: 'Departments',
        link: '/departments',
        exact: false,
    },
    {
        icon: Microscope,
        name: 'Workshop',
        link: '/shops',
        exact: false,
    },
];

const Sidebar = () => {
    const pathname = usePathname();
    const { data } = useSession();

    return (
        <aside className="sticky top-0  h-svh w-[240px] flex-col justify-between border-r bg-primary">
            <div className="">
                <div className="mt-4 flex flex-col items-center">
                    <Avatar className="h-16 w-16 flex-shrink-0">
                        <AvatarImage src={data?.user.avatar} />
                        <AvatarFallback>
                            {data?.user?.name
                                ?.split(' ')
                                .map((name: string) => name[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="mt-2 w-full px-3">
                        <p className="text-center text-sm font-semibold text-white">{data?.user.name}</p>
                    </div>
                </div>

                <div>
                    <ul className="mt-8 flex w-full flex-col gap-1 px-2">
                        {links.map((link) => (
                            <Link
                                className="rounded-md ring-offset-white transition-colors hover:bg-white/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                href={link.link}
                                key={link.name}
                            >
                                <li
                                    className={cn(
                                        'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white ',
                                        isRouterPathnameMatched(link.link, pathname, link.exact) &&
                                            'bg-white text-black'
                                    )}
                                >
                                    <link.icon width={20} height={20} />
                                    <span>{link.name}</span>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>
            </div>

            {/* <div className={cn('px-4')}>
                <div className="justify-between border-t py-4">
                    <div className="flex gap-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src="https://cumillapoly.gov.bd/wp-content/uploads/elementor/thumbs/300521_02_59_10-pw3wkuctbqgomd0rbugx0zkr2bqfu9m3bbalucmo0w.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm">Admin</p>
                            <p className="text-sm text-muted-foreground">admin@dhakai.com</p>
                        </div>
                    </div>
                    <div className="mt-2.5 flex w-full items-center justify-center gap-2.5">
                        <Button variant="secondary" onClick={() => signOut()} size="sm" className="border-none">
                            <LogOut className="mr-2" width={18} height={18} />
                            Logout
                        </Button>
                    </div>
                </div>
            </div> */}
        </aside>
    );
};

export default Sidebar;
