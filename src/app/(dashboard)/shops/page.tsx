'use client';
import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Dialog } from '@radix-ui/react-dialog';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { departments, getRandomPastDate } from '../departments/page';
import ShopFilter from './components/ShopFilter';
import ShopsTable from './components/ShopsTable';

export const _shops = [
    {
        uid: '1',
        name: 'Welding Shop',
        department: 'Mechanical Technology',
        totalShops: 140,
        lastUpdatedAt: getRandomPastDate(20),
        updatedBy: 'Md. Shohel Rana',
        shopInstructor: 'Md. Shohel Rana',
    },
    {
        uid: '2',
        name: 'Machine shop',
        totalShops: 20,
        lastUpdatedAt: getRandomPastDate(10),
        department: 'Mechanical Technology',
        updatedBy: 'Eng. Gazi Faruq',
        shopInstructor: 'Md. Shohel Rana',
    },

    {
        uid: '3',
        name: 'Electrical Shop',
        totalShops: 323,
        lastUpdatedAt: getRandomPastDate(80),
        department: 'Electrical Technology',
        updatedBy: 'Eng. Murad Hossain',
        shopInstructor: 'Md. Shohel Rana',
    },
    {
        uid: '4',
        name: 'Electronics Shop',
        totalShops: 522,
        lastUpdatedAt: getRandomPastDate(30),
        department: 'Electronics Technology',
        updatedBy: 'Eng. Sulaiman Hossain',
        shopInstructor: 'Md. Shohel Rana',
    },
    {
        uid: '5',
        name: 'Power Shop',
        totalShops: 89,
        department: 'Power Technology',
        lastUpdatedAt: getRandomPastDate(29),
        updatedBy: 'Eng. Abdullah Al Mamun',
        shopInstructor: 'Md. Shohel Rana',
    },
    {
        uid: '6',
        name: 'Computer hardware Shop',
        department: 'Computer Technology',
        totalShops: 2,
        lastUpdatedAt: getRandomPastDate(3),
        updatedBy: 'Eng. Abdullah Al Mamun',
        shopInstructor: 'Md. Shohel Rana',
    },
    {
        uid: '7',
        name: 'Physics Shop',
        totalShops: 2,
        department: 'Non Tech',
        lastUpdatedAt: getRandomPastDate(3),
        updatedBy: 'Eng. Abdullah Al Mamun',
        shopInstructor: 'Md. Shohel Rana',
    },
];

function searchShops(word = '') {
    return _shops.filter(
        (shop) =>
            shop.department.toLowerCase().includes(word.toLowerCase()) ||
            shop.name.toLowerCase().includes(word.toLowerCase())
    );
}

export type ShopsType = typeof _shops;

const ShopsPage = () => {
    const [shops] = useState(_shops);
    const searchQuery = useSearchParams().get('search');
    const filteredShops = searchShops(searchQuery || '');
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    return (
        <Container>
            <div className="flex justify-between">
                <PageHeading title="Shops" description="View all shop list" />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Add new shop</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add new shop</DialogTitle>
                        </DialogHeader>
                        <div>
                            <form>
                                <Label className="mb-2 block" htmlFor="Name">
                                    Department name
                                </Label>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Department</SelectLabel>
                                            {departments.map((department) => (
                                                <SelectItem key={department.uid} value={department.name}>
                                                    {department.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Label className="mb-2 mt-2.5 block" htmlFor="Name">
                                    Shop name
                                </Label>
                                <Input
                                    className="mb-3"
                                    id="Name"
                                    placeholder="Shop name"
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
            <ShopFilter />
            <ShopsTable data={filteredShops.length ? filteredShops : shops} />
        </Container>
    );
};

export default ShopsPage;
