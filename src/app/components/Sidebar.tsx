'use client';

import { cn, isRouterPathnameMatched } from '@/lib/utils';
import { LogOut, Microscope, School } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
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

    return (
        <aside className="sticky top-0 h-screen w-[240px] flex-col justify-between border-r">
            <div className="h-[calc(100%-154px)]">
                <div className="mt-8 flex items-center gap-3  px-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        height={60}
                        width={60}
                        className="rounded-full border"
                        src="https://cumillapoly.gov.bd/wp-content/uploads/elementor/thumbs/300521_02_59_10-pw3wkuctbqgomd0rbugx0zkr2bqfu9m3bbalucmo0w.png"
                        alt="Cumilla polytechnic institute"
                    />
                </div>
                <div>
                    <ul className="mt-10 flex w-full flex-col gap-1 px-2">
                        {links.map((link) => (
                            <Link
                                className="rounded-md ring-offset-background transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                href={link.link}
                                key={link.name}
                            >
                                <li
                                    className={cn(
                                        'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground ',
                                        isRouterPathnameMatched(link.link, pathname, link.exact) &&
                                            'bg-muted text-foreground'
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

            <div className={cn('px-4')}>
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
            </div>
        </aside>
    );
};

export default Sidebar;
