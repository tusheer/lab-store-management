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
import { signOut, useSession } from 'next-auth/react';

const Navbar = () => {
    const { data } = useSession();

    return (
        <nav className="z-50 border-b bg-white">
            <Container className="sticky top-0 z-50 flex h-16 items-center justify-between py-0">
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
                        <span className="text-xl font-bold text-primary">Comilla Polytechnic Institute</span>
                    </h2>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-10 w-10 flex-shrink-0 cursor-pointer">
                            <AvatarImage src={data?.user.avatar} />
                            <AvatarFallback>
                                {data?.user?.name
                                    ?.split(' ')
                                    .map((name: string) => name[0])
                                    .join('')}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>
                            <div className="flex items-center gap-1.5">
                                <Avatar className="h-7 w-7 flex-shrink-0 cursor-pointer">
                                    <AvatarImage src={data?.user.avatar} />
                                    <AvatarFallback className="text-[10px] font-medium">
                                        {data?.user?.name
                                            ?.split(' ')
                                            .map((name: string) => name[0])
                                            .join('')}
                                    </AvatarFallback>
                                </Avatar>
                                {data?.user.name}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
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
