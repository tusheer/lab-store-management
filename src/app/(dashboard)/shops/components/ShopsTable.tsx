'use client';

import ProfileHoverCard from '@/app/components/ProfileHoverCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUserAvatar } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Shop } from '../page';

const ShopsTable: React.FC<{ shops: Shop[] }> = ({ shops }) => {
    const router = useRouter();
    return (
        <section className="mt-5 overflow-x-auto rounded-md border">
            <Table className="min-w-[950px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>Shop name</TableHead>
                        <TableHead>Total instrument</TableHead>
                        <TableHead>Deparment</TableHead>
                        <TableHead>Last updated At</TableHead>
                        <TableHead>Last updated by</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {shops.map((shop) => (
                        <TableRow key={shop.id} className="cursor-pointer">
                            <TableCell>{shop.name}</TableCell>
                            <TableCell>{shop._count.StoreItem}</TableCell>
                            <TableCell>{shop.department?.name}</TableCell>
                            <TableCell>
                                {new Intl.DateTimeFormat('en-US', {
                                    dateStyle: 'medium',
                                }).format(shop.updatedAt)}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5 text-nowrap">
                                    <ProfileHoverCard user={shop.lastUpdatedBy}>
                                        <Avatar className="h-7 w-7">
                                            <AvatarImage src={getUserAvatar(shop.lastUpdatedBy?.avatar)} />
                                            <AvatarFallback className="h-7 w-7 text-xs">
                                                {shop.lastUpdatedBy?.name
                                                    ?.split(' ')
                                                    .map((name: string) => name[0])
                                                    .join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </ProfileHoverCard>
                                    {shop.lastUpdatedBy?.name}
                                </div>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => router.push(`/shops/${shop.id}`)}
                                        >
                                            View shop
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
};

export default ShopsTable;
