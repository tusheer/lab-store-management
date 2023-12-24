import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ShopsType } from '../page';

const ShopsTable = ({ data }: { data: ShopsType }) => {
    const router = useRouter();
    return (
        <section className="mt-5 rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Shop name</TableHead>
                        <TableHead>Total instrument</TableHead>
                        <TableHead>Department name</TableHead>
                        <TableHead>Last updated At</TableHead>
                        <TableHead>Last updated by</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((department) => (
                        <TableRow key={department.uid} className="cursor-pointer">
                            <TableCell>{department.name}</TableCell>
                            <TableCell>{department.totalShops}</TableCell>
                            <TableCell>{department.department}</TableCell>
                            <TableCell>
                                {new Intl.DateTimeFormat('en-US', {
                                    dateStyle: 'medium',
                                }).format(department.lastUpdatedAt)}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5">
                                    <Avatar>
                                        <AvatarFallback className="h-9 w-9">
                                            {department.updatedBy.slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {department.updatedBy}
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
                                            onClick={() => {
                                                router.push(`/shops/1/instruments`);
                                            }}
                                        >
                                            View all instrument
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">Edit shop</DropdownMenuItem>
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
