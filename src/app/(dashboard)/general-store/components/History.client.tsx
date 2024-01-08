import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUserAvatar } from '@/lib/utils';
import { Box } from 'lucide-react';
import { HistoryData } from './History.server';

type HistoryTableProps = {
    data: NonNullable<HistoryData>;
};

const HistoryTable: React.FC<HistoryTableProps> = ({ data }) => {
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
                                <TableCell className='max-w-xs text-wrap'>{d.label}</TableCell>
                                <TableCell>
                                    {new Intl.DateTimeFormat('en-US', {
                                        dateStyle: 'medium',
                                    }).format(d.createdAt)}
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <HoverCard>
                                            <HoverCardTrigger>
                                                <Avatar className="h-7 w-7">
                                                    <AvatarImage src={getUserAvatar(d.user?.avatar)} />
                                                    <AvatarFallback className="h-7 w-7 text-xs">
                                                        {d.user?.name
                                                            ?.split(' ')
                                                            .map((name: string) => name[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </HoverCardTrigger>
                                            <HoverCardContent>
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <Avatar className="h-16 w-16">
                                                        <AvatarImage src={getUserAvatar(d.user?.avatar)} />
                                                        <AvatarFallback className="h-16 w-16 text-xs">
                                                            {d.user?.name
                                                                ?.split(' ')
                                                                .map((name: string) => name[0])
                                                                .join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col items-center gap-1">
                                                        <h4 className="text-lg font-semibold text-gray-800">
                                                            {d.user?.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">{d.user?.email}</p>
                                                        <p className="text-sm text-gray-800">
                                                            <span className="font-semibold">Department: </span>
                                                            {d.user?.department}
                                                        </p>
                                                        <p className="text-sm text-gray-800">
                                                            <span className="font-semibold">Designation: </span>
                                                            {d.user?.designation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
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
