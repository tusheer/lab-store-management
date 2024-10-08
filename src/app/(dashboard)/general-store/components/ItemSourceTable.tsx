'use client';

import Filter from '@/app/components/Filter';
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
import { format } from 'date-fns';
import { Box, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { PurchaseData } from './PurchaseTable.server';
import SourceDetailsDrawer from './SourceDetailsDrawer';

type PurchaseTableProps = {
    data: NonNullable<PurchaseData>;
};

const ItemSourceTable: React.FC<PurchaseTableProps> = ({ data }) => {
    const [open, setOpen] = useState(false);
    const [sourceData, setSourceData] = useState<PurchaseData[0] | null>(null);

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
                <div className="overflow-x-auto rounded-md border">
                    <Table className="min-w-[1200px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Brand Name</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Indent no</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Purchase At</TableHead>
                                <TableHead>Last updated by</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Final quantity</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((d) => (
                                <TableRow key={d.id} className="cursor-pointer">
                                    <TableCell>{d.name}</TableCell>
                                    <TableCell>{d.brandName}</TableCell>
                                    <TableCell>{d.quantity + ' ' + d.unitName}</TableCell>
                                    <TableCell>
                                        {d.totalPrice
                                            ? new Intl.NumberFormat('bn-BD', {
                                                  style: 'currency',
                                                  currency: 'BDT',
                                              }).format(d.totalPrice)
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>{d.indentNo}</TableCell>
                                    <TableCell>{format(d.createdAt, 'LLL dd, y')}</TableCell>
                                    <TableCell>
                                        {d.purchasedAt &&
                                            new Intl.DateTimeFormat('en-US', {
                                                dateStyle: 'medium',
                                            }).format(d.purchasedAt)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <ProfileHoverCard user={d.lastUpdatedBy}>
                                                <Avatar className="h-7 w-7">
                                                    <AvatarImage src={getUserAvatar(d.lastUpdatedBy?.avatar)} />
                                                    <AvatarFallback className="h-7 w-7 text-xs">
                                                        {d.lastUpdatedBy?.name
                                                            ?.split(' ')
                                                            .map((name: string) => name[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </ProfileHoverCard>
                                            {d.lastUpdatedBy?.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="capitalize">{d.sourceType}</TableCell>
                                    <TableCell>{d.finalQuantity + ' ' + d.unitName}</TableCell>
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
                                                    onClick={() => {
                                                        setOpen(true);
                                                        setSourceData(d);
                                                    }}
                                                >
                                                    View details
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="mt-20">
                    <div className="mt-10 flex flex-col items-center justify-center gap-4">
                        <Box size={100} color="gray" strokeWidth={0.7} />
                        <h4 className="text-xl font-medium text-gray-500">No data found</h4>
                    </div>
                </div>
            )}
            <SourceDetailsDrawer data={sourceData} isOpen={open} onClose={setOpen} />
        </div>
    );
};

export default ItemSourceTable;
