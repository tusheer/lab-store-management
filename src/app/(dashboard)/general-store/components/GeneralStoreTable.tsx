'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUserAvatar } from '@/lib/utils';
import { Box, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DistributationDialogForm from './DistributationDialogForm';
import { GeneralStore } from './GeneralStore.server';

type StockTableProps = {
    data: NonNullable<GeneralStore>;
};

const StockTable: React.FC<StockTableProps> = ({ data }) => {
    const router = useRouter();

    const [distributionModal, setDistributionModal] = useState(false);
    const [selectedDistributionitem, setSelectedDistributionItem] = useState({
        storeId: 0,
        name: '',
        unitName: '',
        stock: 0,
    });

    if (data?.length === 0)
        return (
            <div className="mt-20">
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
            </div>
        );

    return (
        <div className="mt-10">
            <div className="overflow-x-auto rounded-md border">
                <Table className="min-w-[800px] ">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Total quantity</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                            <TableHead>Last updated by</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((d) => (
                            <TableRow key={d.id} className="cursor-pointer">
                                <TableCell>{d.name}</TableCell>
                                <TableCell> {d.stockAmount + ' ' + d.unitName}</TableCell>
                                <TableCell>
                                    {new Intl.DateTimeFormat('en-US', {
                                        dateStyle: 'medium',
                                    }).format(d.createdAt)}
                                </TableCell>
                                <TableCell>
                                    {new Intl.DateTimeFormat('en-US', {
                                        dateStyle: 'medium',
                                    }).format(d.updatedAt)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <HoverCard>
                                            <HoverCardTrigger>
                                                <Avatar className="h-7 w-7">
                                                    <AvatarImage src={getUserAvatar(d.lastUpdatedBy?.avatar)} />
                                                    <AvatarFallback className="h-7 w-7 text-xs">
                                                        {d.lastUpdatedBy?.name
                                                            ?.split(' ')
                                                            .map((name: string) => name[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </HoverCardTrigger>
                                            <HoverCardContent>
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <Avatar className="h-16 w-16">
                                                        <AvatarImage src={getUserAvatar(d.lastUpdatedBy?.avatar)} />
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
                                <TableCell>{d.type}</TableCell>

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
                                                View Store Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setSelectedDistributionItem({
                                                        name: d.name,
                                                        unitName: d.unitName,
                                                        storeId: d.id,
                                                        stock: d.stockAmount,
                                                    });

                                                    setDistributionModal(true);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                Dristributaion from this item
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setSelectedDistributionItem({
                                                        name: d.name,
                                                        unitName: d.unitName,
                                                        storeId: d.id,
                                                        stock: d.stockAmount,
                                                    });

                                                    setDistributionModal(true);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                Add new source
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <DistributationDialogForm
                key={selectedDistributionitem.storeId}
                data={selectedDistributionitem}
                setOpen={setDistributionModal}
                open={distributionModal && !!selectedDistributionitem.storeId}
            />
        </div>
    );
};

export default StockTable;
