'use client';

import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export const getRandomPastDate = (days: number) => {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - days);
    return pastDate;
};

export const departments = [
    {
        uid: '1',
        name: 'Mechanical Technology',
        totalShops: 10,
        lastUpdatedAt: getRandomPastDate(20),
        updatedBy: 'Md. Shohel Rana',
    },
    {
        uid: '2',
        name: 'Civil Technology',
        totalShops: 8,
        lastUpdatedAt: getRandomPastDate(10),
        updatedBy: 'Eng. Gazi Faruq',
    },
    {
        uid: '3',
        name: 'Electrical Technology',
        totalShops: 3,
        lastUpdatedAt: getRandomPastDate(80),
        updatedBy: 'Eng. Murad Hossain',
    },
    {
        uid: '4',
        name: 'Electronics Technology',
        totalShops: 5,
        lastUpdatedAt: getRandomPastDate(30),
        updatedBy: 'Eng. Sulaiman Hossain',
    },
    {
        uid: '5',
        name: 'Power Technology',
        totalShops: 5,
        lastUpdatedAt: getRandomPastDate(29),
        updatedBy: 'Eng. Abdullah Al Mamun',
    },
    {
        uid: '6',
        name: 'Computer Technology',
        totalShops: 2,
        lastUpdatedAt: getRandomPastDate(3),
        updatedBy: 'Eng. Abdullah Al Mamun',
    },
    {
        uid: '7',
        name: 'Non Tech',
        totalShops: 2,
        lastUpdatedAt: getRandomPastDate(3),
        updatedBy: 'Eng. Abdullah Al Mamun',
    },
];

const DashboardPage = () => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const router = useRouter();
    return (
        <Container>
            <div className="flex items-center justify-between space-y-2">
                <PageHeading title="Departments" description="View all departments" />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Add new department</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add new department</DialogTitle>
                        </DialogHeader>
                        <div>
                            <form>
                                <Label className="mb-2 block" htmlFor="Name">
                                    Department name
                                </Label>
                                <Input
                                    className="mb-3"
                                    id="Name"
                                    placeholder="Department name"
                                    type="text"
                                    autoCapitalize="none"
                                    autoComplete="Name"
                                    autoCorrect="off"
                                    required
                                />
                            </form>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setIsDialogOpen(false)} type="submit">
                                Submit
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <section className="mt-5 rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Department name</TableHead>
                            <TableHead>Total shops</TableHead>
                            <TableHead>Last updated At</TableHead>
                            <TableHead>Last updated by</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {departments.map((department) => (
                            <TableRow key={department.uid} className="cursor-pointer">
                                <TableCell>{department.name}</TableCell>
                                <TableCell>{department.totalShops}</TableCell>
                                <TableCell>
                                    {new Intl.DateTimeFormat('en-US', {
                                        dateStyle: 'medium',
                                    }).format(department.lastUpdatedAt)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <Avatar className="h-7 w-7">
                                            <AvatarFallback className="h-7 w-7 text-xs">
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
                                                    router.push(
                                                        `/shops/${department.uid}?department=${department.name}`
                                                    );
                                                }}
                                            >
                                                View shop
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                Edit department
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </section>
        </Container>
    );
};

export default DashboardPage;
