'use client';

import Filter from '@/app/components/Filter';
import ProfileHoverCard from '@/app/components/ProfileHoverCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUserAvatar } from '@/lib/utils';
import { Box } from 'lucide-react';
import { DistributionData } from './DistributionTable.server';

type DistributionTableProps = {
    data: DistributionData;
};

const DistributionTable: React.FC<DistributionTableProps> = ({ data }) => {
    return (
        <div className="mt-10">
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
                            <TableRow className="text-nowrap">
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Quantity after</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Shop/Lab</TableHead>
                                <TableHead>Handover to</TableHead>
                                <TableHead>Updated at</TableHead>
                                <TableHead>Distribution date</TableHead>
                                <TableHead>Updated by</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((d) => (
                                <TableRow key={d.id} className="cursor-pointer text-nowrap">
                                    <TableCell>{d.id}</TableCell>
                                    <TableCell>{d.name}</TableCell>
                                    <TableCell>{d.quantity + ' ' + d.unitName}</TableCell>
                                    <TableCell>{d.finalQuantity + ' ' + d.unitName}</TableCell>
                                    <TableCell>{d.department}</TableCell>
                                    <TableCell>{d.shopName}</TableCell>
                                    <TableCell>{d.personName}</TableCell>
                                    <TableCell>
                                        {new Intl.DateTimeFormat('en-US', {
                                            dateStyle: 'medium',
                                        }).format(d.updatedAt)}
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.DateTimeFormat('en-US', {
                                            dateStyle: 'medium',
                                        }).format(d.allocatedAt)}
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
        </div>
    );
};

export default DistributionTable;
