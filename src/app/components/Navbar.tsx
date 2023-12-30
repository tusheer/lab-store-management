'use client';

import Container from '@/components/ui/Container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type NavbarProps = {
    name: string;
    avatar: string;
};

const Navbar: React.FC<NavbarProps> = ({ avatar, name }) => {
    const router = useRouter();

    return (
        <nav className="sticky top-0 z-50 border-b bg-white">
            <Container className="z-50 flex h-16 items-center justify-between py-0">
                <div className="flex w-full items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        height={40}
                        width={40}
                        className="rounded-full border"
                        src="https://cumillapoly.gov.bd/wp-content/uploads/elementor/thumbs/300521_02_59_10-pw3wkuctbqgomd0rbugx0zkr2bqfu9m3bbalucmo0w.png"
                        alt="Cumilla polytechnic institute"
                    />
                    <h2>
                        <span className="hidden text-lg font-bold text-primary lg:block lg:text-base">
                            Comilla Polytechnic Institute
                        </span>
                        <span className="block text-xl font-bold tracking-wider text-primary lg:hidden lg:text-base">
                            CPI
                        </span>
                    </h2>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-10 w-10 flex-shrink-0 cursor-pointer border">
                            <AvatarImage src={avatar} />
                            <AvatarFallback>
                                {name
                                    ?.split(' ')
                                    .map((name: string) => name[0])
                                    .join('')}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>
                            <div className="flex items-center gap-1.5">
                                <Avatar className="h-7 w-7 flex-shrink-0 cursor-pointer border">
                                    <AvatarImage src={avatar} />
                                    <AvatarFallback className="text-[10px] font-medium">
                                        {name
                                            ?.split(' ')
                                            .map((name: string) => name[0])
                                            .join('')}
                                    </AvatarFallback>
                                </Avatar>
                                {name}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                                router.push('/profile');
                            }}
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                signOut();
                            }}
                            className="cursor-pointer"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Container>
        </nav>
    );
};

export default Navbar;
