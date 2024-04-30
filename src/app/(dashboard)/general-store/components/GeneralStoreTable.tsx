'use client';

import Filter from '@/app/components/Filter';
import Paginator from '@/app/components/Paginator';
import ProfileHoverCard from '@/app/components/ProfileHoverCard';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, getUserAvatar } from '@/lib/utils';
import { Box, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useEffect, useState } from 'react';
import { GeneralStoreItem } from './GeneralStore.server';
import NoteAddModal from './NewNoteModal';
import SeperateItemModal from './SeperateItemModal';
import UpdateItemStatusModal from './UpdateItemStatusModal';

type StockTableProps = {
    data: NonNullable<GeneralStoreItem>;
};

const StockTable: React.FC<StockTableProps> = ({ data }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isNotMoalOpen, setIsNoteModalOpen] = useState(false);
    const [updatedId, setUpdatedId] = useState<string | null>(null);
    const [selectedStore, setSelectedStore] = useState<NonNullable<GeneralStoreItem['items'][0]> | undefined>(
        undefined
    );
    const [separateItemModal, setSeparateItemModal] = useState(false);
    const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);

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
                        placeholder: 'Search by name, location, user',
                    },
                    {
                        queryKey: 'type',
                        type: 'select',
                        options: [
                            {
                                label: 'Machine',
                                value: 'machine',
                            },
                            {
                                label: 'Tools',
                                value: 'tools',
                            },
                            {
                                label: 'Material',
                                value: 'material',
                            },
                            {
                                label: 'Furniture',
                                value: 'furniture',
                            },
                            {
                                label: 'Electronics',
                                value: 'electronics',
                            },
                            {
                                label: 'Stationary',
                                value: 'stationary',
                            },
                            {
                                label: 'Rawmaterial',
                                value: 'rawmaterial',
                            },
                            {
                                label: 'Vehicle',
                                value: 'vehicle',
                            },

                            {
                                label: 'Other',
                                value: 'other',
                            },
                        ],
                        placeholder: 'Select type',
                    },
                    {
                        queryKey: 'status',
                        type: 'select',
                        options: [
                            {
                                label: 'Operational',
                                value: 'operational',
                            },
                            {
                                label: 'Faulty',
                                value: 'faulty',
                            },
                            {
                                label: 'Under repair',
                                value: 'underRepair',
                            },
                            {
                                label: 'Disposed',
                                value: 'disposed',
                            },
                        ],
                        placeholder: 'Select status',
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
            {data?.items.length > 0 ? (
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
                                {data?.items.map((d) => (
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
                                                            setSelectedStore(d);
                                                            setSeparateItemModal(true);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        Separate item
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedStore(d);
                                                            setIsUpdateStatusModalOpen(true);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        Update status
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setIsNoteModalOpen(true);
                                                            setSelectedStore(d);
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
                        key={selectedStore?.id}
                        selectedStoreId={selectedStore?.id}
                        isOpen={isNotMoalOpen}
                        onClose={() => setIsNoteModalOpen(false)}
                    />

                    {selectedStore?.id && (
                        <SeperateItemModal
                            key={selectedStore?.id}
                            data={{
                                itemId: selectedStore?.id,
                                stock: selectedStore?.stockAmount,
                            }}
                            isOpen={separateItemModal}
                            onClose={() => setSeparateItemModal(false)}
                        />
                    )}

                    {selectedStore?.id && (
                        <UpdateItemStatusModal
                            key={selectedStore?.id}
                            data={{
                                itemId: selectedStore?.id,
                                name: selectedStore?.name,
                                status: selectedStore?.status,
                            }}
                            isOpen={isUpdateStatusModalOpen}
                            onClose={() => setIsUpdateStatusModalOpen(false)}
                        />
                    )}
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
            {data.totalPages > 1 && (
                <Paginator
                    className="mt-5"
                    currentPage={data.currentPage}
                    onPageChange={(e) => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('page', e.toString());
                        startTransition(() => {
                            router.push(`/general-store?${params.toString()}`);
                        });
                    }}
                    showPreviousNext={true}
                    totalPages={data.totalPages}
                    key={data?.items.length}
                />
            )}
        </div>
    );
};

export default StockTable;
