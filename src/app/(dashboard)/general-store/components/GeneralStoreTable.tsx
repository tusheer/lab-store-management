'use client';

import Filter from '@/app/components/Filter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, getUserAvatar } from '@/lib/utils';
import { Box, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GeneralStore } from './GeneralStore.server';
import NoteAddModal from './NewNoteModal';

type StockTableProps = {
    data: NonNullable<GeneralStore>;
};

const StockTable: React.FC<StockTableProps> = ({ data }) => {
    const router = useRouter();
    const [isNotMoalOpen, setIsNoteModalOpen] = useState(false);
    const [updatedId, setUpdatedId] = useState<string | null>(null);
    const [selectedStoreId, setSelectedStoreId] = useState<number | undefined>(undefined);

    const recentUpdated = useSearchParams().get('recentUpdated');

    useEffect(() => {
        if (recentUpdated) {
            setUpdatedId(recentUpdated);
        }
        const timer = setTimeout(() => {
            setUpdatedId(null);
        }, 5000);

        return () => clearTimeout(timer);
    }, [recentUpdated]);

    return (
        <div className="mt-6">
            <Filter
                className="mb-6"
                inputs={[
                    {
                        queryKey: 'search',
                        type: 'text',
                        placeholder: 'Search by name',
                    },
                    {
                        queryKey: 'date',
                        type: 'date',
                        placeholder: 'Pick date range',
                        dateKey: ['startDate', 'endDate'],
                    },
                ]}
                path="/general-store"
            />
            {data?.length > 0 ? (
                <>
                    <div className="overflow-x-auto rounded-md border">
                        <Table className="min-w-[800px] ">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-nowrap"> Total quantity</TableHead>
                                    <TableHead className="text-nowrap">Created At</TableHead>
                                    <TableHead className="text-nowrap">Updated At</TableHead>
                                    <TableHead className="text-nowrap">Last updated by</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.map((d) => (
                                    <TableRow
                                        key={d.id}
                                        className={cn(
                                            'cursor-pointer',
                                            d.id.toString() === updatedId && 'bg-green-100',
                                            d.alertWhenStockAmountIsLessThan &&
                                                d.alertWhenStockAmountIsLessThan > d.stockAmount &&
                                                'bg-red-100'
                                        )}
                                    >
                                        <TableCell>{d.id}</TableCell>
                                        <TableCell className="max-w-36 truncate text-nowrap">{d.name}</TableCell>
                                        <TableCell className="text-nowrap">
                                            {' '}
                                            {d.stockAmount + ' ' + d.unitName}
                                        </TableCell>
                                        <TableCell className="text-nowrap">
                                            {new Intl.DateTimeFormat('en-US', {
                                                dateStyle: 'medium',
                                            }).format(d.createdAt)}
                                        </TableCell>
                                        <TableCell className="text-nowrap">
                                            {new Intl.DateTimeFormat('en-US', {
                                                dateStyle: 'medium',
                                            }).format(d.updatedAt)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-nowrap">
                                                <HoverCard>
                                                    <HoverCardTrigger asChild>
                                                        <button>
                                                            <Avatar className="h-7 w-7">
                                                                <AvatarImage
                                                                    src={getUserAvatar(d.lastUpdatedBy?.avatar)}
                                                                />
                                                                <AvatarFallback className="h-7 w-7 text-xs">
                                                                    {d.lastUpdatedBy?.name
                                                                        ?.split(' ')
                                                                        .map((name: string) => name[0])
                                                                        .join('')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        </button>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent>
                                                        <div className="flex flex-col items-center gap-1.5">
                                                            <Avatar className="h-16 w-16">
                                                                <AvatarImage
                                                                    src={getUserAvatar(d.lastUpdatedBy?.avatar)}
                                                                />
                                                                <AvatarFallback className="h-16 w-16 text-xs">
                                                                    {d.lastUpdatedBy?.name
                                                                        ?.split(' ')
                                                                        .map((name: string) => name[0])
                                                                        .join('')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col items-center gap-1">
                                                                <h4 className="text-lg font-semibold text-gray-800">
                                                                    {d.lastUpdatedBy?.name}
                                                                </h4>
                                                                <p className="text-sm text-gray-500">
                                                                    {d.lastUpdatedBy?.email}
                                                                </p>
                                                                <p className="text-sm text-gray-800">
                                                                    <span className="font-semibold">Department: </span>
                                                                    {d.lastUpdatedBy?.department}
                                                                </p>
                                                                <p className="text-sm text-gray-800">
                                                                    <span className="font-semibold">Designation: </span>
                                                                    {d.lastUpdatedBy?.designation}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                                {d.lastUpdatedBy?.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="capitalize">{d.type}</TableCell>
                                        <TableCell className="capitalize">{d.status}</TableCell>

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
                                                        onClick={() => router.push(`/general-store/${d.id}/view`)}
                                                        className="cursor-pointer"
                                                    >
                                                        Store details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            router.push(`/general-store/${d.id}/view?tab=distribution`)
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        Distribution list
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            router.push(`/general-store/${d.id}/view?tab=source`)
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        View source list
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            router.push(`/general-store/${d.id}/view?tab=notes`)
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        Notes
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            router.push(`/general-store/${d.id}/distribution/create`);
                                                        }}
                                                        className="cursor-pointer hover:bg-gray-100"
                                                    >
                                                        Create dristributaion
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            router.push(`/general-store/${d.id}/source/create`);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        Create source
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setIsNoteModalOpen(true);
                                                            setSelectedStoreId(d.id);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        Create note
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <NoteAddModal
                        key={selectedStoreId}
                        selectedStoreId={selectedStoreId}
                        isOpen={isNotMoalOpen}
                        onClose={() => setIsNoteModalOpen(false)}
                    />
                </>
            ) : (
                <div className="mt-10 flex flex-col items-center justify-center gap-4">
                    <Box size={100} color="gray" strokeWidth={0.7} />
                    <h4 className="text-xl font-medium text-gray-500">No data found</h4>
                    <Link
                        href={{
                            pathname: '/general-store/new',
                        }}
                    >
                        <Button className="px-5 py-5">Add new item</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default StockTable;
