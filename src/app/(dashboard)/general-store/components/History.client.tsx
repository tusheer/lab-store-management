import ProfileHoverCard from '@/app/components/ProfileHoverCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUserAvatar } from '@/lib/utils';
import { Box } from 'lucide-react';
import { HistoryData } from './History.server';

type HistoryTableProps = {
    data: NonNullable<HistoryData>;
};

const HistoryTable: React.FC<HistoryTableProps> = ({ data }) => {
    // need to add tag here based on the history type
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
            <div className="overflow-x-auto rounded-md border ">
                <Table className="min-w-[1200px] ">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Label</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated by</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((d) => (
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
        </div>
    );
};

export default HistoryTable;
