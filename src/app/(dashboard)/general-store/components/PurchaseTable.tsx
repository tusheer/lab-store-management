import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUserAvatar } from '@/lib/utils';
import { Box } from 'lucide-react';
import { PurchaseData } from './PurchaseTable.server';

type PurchaseTableProps = {
    data: NonNullable<PurchaseData>;
};

const PurchaseTable: React.FC<PurchaseTableProps> = ({ data }) => {
    if (data?.length === 0)
        return (
            <div className="mt-20">
                <div className="mt-10 flex flex-col items-center justify-center gap-4">
                    <Box size={100} color="gray" strokeWidth={0.7} />
                    <h4 className="text-xl font-medium text-gray-500">No data found</h4>
                </div>
            </div>
        );

    return (
        <div className="mt-10">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Unit name</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                            <TableHead>Last updated by</TableHead>
                            <TableHead>Type</TableHead>

                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((d) => (
                            <TableRow key={d.id} className="cursor-pointer">
                                <TableCell>{d.name}</TableCell>
                                <TableCell>{d.unitName}</TableCell>
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
                                        <Avatar className="h-7 w-7">
                                            <AvatarImage src={getUserAvatar(d.lastUpdatedBy?.avatar)} />
                                            <AvatarFallback className="h-7 w-7 text-xs">
                                                {d.lastUpdatedBy?.name
                                                    ?.split(' ')
                                                    .map((name: string) => name[0])
                                                    .join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        {d.lastUpdatedBy?.name}
                                    </div>
                                </TableCell>
                                <TableCell>"</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default PurchaseTable;
