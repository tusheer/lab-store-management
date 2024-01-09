'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createNewActiveFinancialYear } from '../../general-store/actions';
import { FinancialYearCreateSchema, financialYearCreateSchema } from '../../general-store/schema';

const FinancialYearCreateDialog = () => {
    const [open, setOpen] = useState(false);
    const form = useForm<FinancialYearCreateSchema>({
        resolver: zodResolver(financialYearCreateSchema),
        defaultValues: {
            name: '',
            date: [undefined, undefined],
        },
    });

    const router = useRouter();

    const onSubmit = async (data: FinancialYearCreateSchema) => {
        try {
            await createNewActiveFinancialYear(data);
            setOpen(false);
            toast.success('Financial year created successfully');
            router.refresh();
        } catch (error) {
            toast.error((error as Error).message);
        }
    };
    const searchParams = useSearchParams();
    const isModalOpen = searchParams.get('modal') === 'true';
    useEffect(() => {
        if (isModalOpen) {
            setOpen(true);
        }
    }, [searchParams, isModalOpen]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add new year</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new year</DialogTitle>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter financial year name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="blocl">Select date range</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="date"
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !field.value[0] && 'text-muted-foreground'
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value[0] ? (
                                                            field.value[1] ? (
                                                                <>
                                                                    {format(field.value[0], 'LLL dd, y')} -{' '}
                                                                    {format(field.value[1], 'LLL dd, y')}
                                                                </>
                                                            ) : (
                                                                format(field.value[0], 'LLL dd, y')
                                                            )
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        initialFocus
                                                        mode="range"
                                                        defaultMonth={new Date()}
                                                        selected={{
                                                            from: field.value[0],
                                                            to: field.value[1],
                                                        }}
                                                        onSelect={(date) => {
                                                            field.onChange([date?.from, date?.to]);
                                                        }}
                                                        numberOfMonths={2}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit">
                                    {form.formState.isSubmitting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Submit
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FinancialYearCreateDialog;
