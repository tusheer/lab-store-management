'use client';

import { getRandomPastDate } from '@/app/(dashboard)/departments/page';
import Container from '@/components/ui/Container';
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
import { debounce } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

const _instruments = [
    {
        id: '1',
        name: 'Welding Machine',
        total: 2,
        lastUpdatedAt: getRandomPastDate(20),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '2',
        name: 'Safety Helmet',
        total: 10,
        lastUpdatedAt: getRandomPastDate(30),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '3',
        name: 'Welding Gloves',
        total: 15,
        lastUpdatedAt: getRandomPastDate(15),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '4',
        name: 'Protective Goggles',
        total: 10,
        lastUpdatedAt: getRandomPastDate(10),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '5',
        name: 'Angle Grinder',
        total: 5,
        lastUpdatedAt: getRandomPastDate(25),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '6',
        name: 'Chipping Hammer',
        total: 8,
        lastUpdatedAt: getRandomPastDate(18),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },

    {
        id: '7',
        name: 'Welding Electrodes',
        total: 50,
        lastUpdatedAt: getRandomPastDate(12),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '8',
        name: 'Welding Wire',
        total: 30,
        lastUpdatedAt: getRandomPastDate(15),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '9',
        name: 'Welding Jacket',
        total: 12,
        lastUpdatedAt: getRandomPastDate(22),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '10',
        name: 'Welding Table',
        total: 3,
        lastUpdatedAt: getRandomPastDate(30),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '11',
        name: 'Welding Helmet',
        total: 10,
        lastUpdatedAt: getRandomPastDate(20),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '12',
        name: 'Gas Regulator',
        total: 4,
        lastUpdatedAt: getRandomPastDate(18),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '13',
        name: 'Clamping Tools',
        total: 15,
        lastUpdatedAt: getRandomPastDate(16),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '14',
        name: 'Welding Curtains',
        total: 5,
        lastUpdatedAt: getRandomPastDate(14),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '15',
        name: 'Grinding Discs',
        total: 20,
        lastUpdatedAt: getRandomPastDate(12),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '16',
        name: 'Wire Brushes',
        total: 10,
        lastUpdatedAt: getRandomPastDate(10),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '17',
        name: 'Earth Clamps',
        total: 6,
        lastUpdatedAt: getRandomPastDate(8),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '18',
        name: 'C-Clamps',
        total: 15,
        lastUpdatedAt: getRandomPastDate(6),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '19',
        name: 'Portable Bandsaw',
        total: 2,
        lastUpdatedAt: getRandomPastDate(4),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
    {
        id: '20',
        name: 'Metal Marking Tools',
        total: 10,
        lastUpdatedAt: getRandomPastDate(2),
        updatedBy: 'Md. Shohel Rana',
        shop: 'Welding Shop',
        shopInstructor: 'Md. Shohel Rana',
        department: 'Mechanical Technology',
        shopId: '1',
        departmentId: '1',
        unitName: 'Pcs',
    },
];

function searchShops(word = '') {
    return _instruments.filter(
        (shop) =>
            shop.department.toLowerCase().includes(word.toLowerCase()) ||
            shop.name.toLowerCase().includes(word.toLowerCase())
    );
}

const InstrumentsPage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const [, trasition] = useTransition();

    const form = useForm({
        defaultValues: {
            search: searchParams.get('search'),
        },
    });

    const onSearchQuery = useCallback(
        (query: Record<string, string | null | undefined>) => {
            const params = new URLSearchParams();

            Object.keys(query).forEach((key) => {
                const value = query[key];
                if (value) {
                    params.set(key, value);
                }
            });

            trasition(() => {
                router.push(`/shops/1/instruments?${params.toString()}`);
            });
        },
        [router]
    );

    const delayedQuery = debounce((query: Record<string, string>) => onSearchQuery(query), 300);

    useEffect(() => {
        const subscription = form.watch((value) => {
            delayedQuery(value);
        });
        return () => subscription.unsubscribe();
    }, [form, delayedQuery, onSearchQuery]);

    const searchQuery = useSearchParams().get('search');
    const filteredShops = searchShops(searchQuery || '');

    const instuments = filteredShops.length ? filteredShops : _instruments;

    return (
        <Container>
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Instruments</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Add new instrument</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add new instrument</DialogTitle>
                        </DialogHeader>
                        <div>
                            <form>
                                <Label className="mb-2 mt-2.5 block" htmlFor="Name">
                                    Instruments name
                                </Label>
                                <Input
                                    className="mb-3"
                                    id="Name"
                                    placeholder="Instruments name"
                                    type="text"
                                    autoCapitalize="none"
                                    autoComplete="Name"
                                    autoCorrect="off"
                                    required
                                />
                                <Label className="mb-2 mt-2.5 block" htmlFor="Name">
                                    Quantity
                                </Label>
                                <Input
                                    className="mb-3"
                                    id="Quantity"
                                    placeholder="Quantity"
                                    type="text"
                                    autoCapitalize="none"
                                    autoComplete="Name"
                                    autoCorrect="off"
                                    required
                                />
                                <Label className="mb-2 mt-2.5 block" htmlFor="Name">
                                    Unit name
                                </Label>
                                <Input
                                    className="mb-3"
                                    id="Name"
                                    placeholder="Unit name"
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
            <div className="mt-6 flex items-center gap-4">
                <Input className="w-3/12" placeholder="Search by name" {...form.register('search')} />
            </div>

            <section className="mt-5 rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Instrument name</TableHead>
                            <TableHead>Shop</TableHead>
                            <TableHead>Total quantity</TableHead>
                            <TableHead>Last updated At</TableHead>
                            <TableHead>Last updated by</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {instuments.map((instrument) => (
                            <TableRow key={instrument.id} className="cursor-pointer">
                                <TableCell>{instrument.name}</TableCell>
                                <TableCell>{instrument.shop}</TableCell>
                                <TableCell>{instrument.total + ' ' + instrument.unitName}</TableCell>
                                <TableCell>
                                    {new Intl.DateTimeFormat('en-US', {
                                        dateStyle: 'medium',
                                    }).format(instrument.lastUpdatedAt)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <Avatar>
                                            <AvatarFallback className="h-9 w-9">
                                                {instrument.updatedBy.slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {instrument.updatedBy}
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
                                            <DropdownMenuItem>View all instrument</DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">Edit shop</DropdownMenuItem>
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

export default InstrumentsPage;
