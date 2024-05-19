import { getServerSubdomain } from '@/app/action';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOption';
import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import prisma from '@/lib/prisma';
import { MoreHorizontal } from 'lucide-react';
import { getServerSession } from 'next-auth';

const getAllDepartments = async () => {
    const userSession = await getServerSession(authOptions);

    if (!userSession) {
        return [];
    }

    const subdomain = await getServerSubdomain();
    const response = await prisma.department.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    Store: true,
                },
            },
        },
        where: {
            institution: {
                subdomain,
            },
            permissions: {
                some: {
                    id: Number(userSession.user.id),
                },
            },
        },
    });

    return response;
};
const DashboardPage = async () => {
    const departments = await getAllDepartments();
    return (
        <Container>
            <div className="flex items-center justify-between space-y-2">
                <PageHeading title="Departments" description="View all departments" />
            </div>
            <section className="mt-5 overflow-x-auto rounded-md border">
                <Table className="min-w-[800px] ">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Department name</TableHead>
                            <TableHead>Total shops</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {departments.map((department) => (
                            <TableRow key={department.id} className="cursor-pointer">
                                <TableCell>{department.name}</TableCell>
                                <TableCell>{department._count.Store}</TableCell>

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
