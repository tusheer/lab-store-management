'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, isRouterPathnameMatched } from '@/lib/utils';
import { LineChart, Microscope, School, Store } from 'lucide-react';
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

type SidebarProps = {
    name: string;
    avatar: string;
};

const Sidebar: React.FC<SidebarProps> = ({ avatar, name }) => {
    const pathname = usePathname();

    return (
        <aside className="fixed bottom-0  z-30 h-auto  w-full  flex-row items-center  border-r bg-primary py-4 lg:sticky lg:top-0 lg:block lg:h-svh lg:w-[240px] lg:flex-col lg:justify-between lg:py-0  ">
            <div className="">
                <div className="mt-4  hidden flex-col items-center lg:flex">
                    <Avatar className="h-16 w-16 flex-shrink-0">
                        <AvatarImage src={avatar} />
                        <AvatarFallback>
                            {name
                                ?.split(' ')
                                .map((name: string) => name[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="mt-2 w-full px-3">
                        <p className="text-center text-sm font-semibold text-white">{name}</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <ul className="flex w-full  min-w-full gap-3 px-2 lg:mt-8  lg:min-w-0 lg:flex-col lg:gap-2">
                        {links.map((link) => (
                            <Link
                                className="flex w-fit flex-shrink-0 gap-5 rounded-md ring-offset-white transition-colors hover:bg-white/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 lg:w-full"
                                href={link.link}
                                key={link.name}
                            >
                                <li
                                    className={cn(
                                        'flex flex-shrink-0  cursor-pointer flex-col items-center gap-2  rounded-md px-2 py-2 text-[10px] font-medium text-white lg:w-full lg:flex-row lg:gap-3 lg:px-3 lg:text-sm ',
                                        isRouterPathnameMatched(link.link, pathname, link.exact) &&
                                            'bg-white text-black'
                                    )}
                                >
                                    <link.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                                    <span>{link.name}</span>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
