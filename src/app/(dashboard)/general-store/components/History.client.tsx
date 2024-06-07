'use client';

import Filter from '@/app/components/Filter';
import Paginator from '@/app/components/Paginator';
import ProfileHoverCard from '@/app/components/ProfileHoverCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUserAvatar } from '@/lib/utils';
import { Box } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition } from 'react';
import { HistoryData } from './History.server';

type HistoryTableProps = {
    data: NonNullable<HistoryData>;
};

const HistoryTable: React.FC<HistoryTableProps> = ({ data }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    // need to add tag here based on the history type
    if (data?.items.length === 0)
        return (
            <div className="mt-20">
                <div className="mt-10 flex flex-col items-center justify-center gap-4">
                    <Box size={100} color="gray" strokeWidth={0.7} />
                    <h4 className="text-xl font-medium text-gray-500">No data found</h4>
                </div>
            </div>
        );

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
            <div className="overflow-x-auto rounded-md border">
                <Table className="min-w-[1200px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Label</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated by</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.items.map((d) => (
                            <TableRow key={d.id} className="cursor-pointer">
                                <TableCell className="max-w-xs text-wrap">{d.label}</TableCell>
                                <TableCell>
                                    {new Intl.DateTimeFormat('en-US', {
                                        dateStyle: 'medium',
                                    }).format(d.createdAt)}
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <ProfileHoverCard user={d.user}>
                                            <Avatar className="h-7 w-7">
                                                <AvatarImage src={getUserAvatar(d.user?.avatar)} />
                                                <AvatarFallback className="h-7 w-7 text-xs">
                                                    {d.user?.name
                                                        ?.split(' ')
                                                        .map((name: string) => name[0])
                                                        .join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                        </ProfileHoverCard>

                                        {d.user?.name}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
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

export default HistoryTable;
