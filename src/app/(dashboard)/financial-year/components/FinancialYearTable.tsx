'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { FinancialYear } from '../page';
import ConfirmInactiveFinalcialYear from './ConfirmInactiveFinalcialYear';

const FinancialYearTable = ({ data }: { data: FinancialYear }) => {
    const [inactiveModal, setInactiveModal] = useState(false);
    const [inactiveId, setInactiveId] = useState<null | number>(null);

    return (
        <section className="mt-5">
            <ConfirmInactiveFinalcialYear open={inactiveModal} setOpen={setInactiveModal} id={inactiveId} />
            <div className="overflow-x-auto rounded-md border">
                <Table className="min-w-[650px] ">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Start date</TableHead>
                            <TableHead>End date</TableHead>
                            <TableHead>Is closed</TableHead>

                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((year) => (
                            <TableRow key={year.id} className="cursor-pointer">
                                <TableCell>{year.name}</TableCell>
                                <TableCell>{format(new Date(year?.startDate || ''), 'dd MMM yyyy')}</TableCell>
                                <TableCell>{format(new Date(year?.endDate || ''), 'dd MMM yyyy')}</TableCell>
                                <TableCell>
                                    <span
                                        className={cn('inline-flex rounded-full px-2 text-xs font-semibold leading-5', {
                                            'bg-green-100 text-green-800': year.isActive,
                                            'bg-red-100 text-red-800': !year.isActive,
                                        })}
                                    >
                                        {year.isActive ? 'Active' : 'Inactive'}
                                    </span>
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
                                            {year.isActive && (
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setInactiveModal(true);
                                                        setInactiveId(year.id);
                                                    }}
                                                >
                                                    Close year
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
};

export default FinancialYearTable;
