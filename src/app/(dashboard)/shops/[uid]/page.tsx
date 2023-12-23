'use client';

import Container from '@/components/ui/Container';
import React from 'react';
import ShopsTable from '../components/ShopsTable';
import PageHeading from '@/components/ui/PageHeading';
import { _shops } from '../page';
import { useSearchParams } from 'next/navigation';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { departments } from '../../departments/page';

const ShopsPage = ( ) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const searchParams = useSearchParams();
    const shop = _shops.filter((shop) => shop.department === searchParams.get('department'));
    return (
        <Container>
            <div className='flex justify-between'>
                <PageHeading
                    title='Shops'
                    description={`View the list of all shops in the ${searchParams.get('department')}  department`}
                />
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
                                <Label className='block mb-2' htmlFor='Name'>
                                    Department name
                                </Label>
                                <Select value={searchParams.get('department') || ''} disabled>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select department' />
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
                                <Label className='block mb-2 mt-2.5' htmlFor='Name'>
                                    Shop name
                                </Label>
                                <Input
                                    className='mb-3'
                                    id='Name'
                                    placeholder='Shop name'
                                    type='text'
                                    autoCapitalize='none'
                                    autoComplete='Name'
                                    autoCorrect='off'
                                    required
                                />
                            </form>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setIsDialogOpen(false)} type='submit'>
                                Submit
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <ShopsTable data={shop || []} />
        </Container>
    );
};

export default ShopsPage;
