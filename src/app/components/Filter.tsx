import { Input } from '@/components/ui/input'; // assuming these are your components
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { cn, debounce } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

type ShopFilterInput = {
    type: 'text' | 'date' | 'select';
    placeholder?: string;
    queryKey: string;
    label?: string;
    className?: string;
    options?: { value: string; label: string }[];
    dateKey?: [string, string];
};

type ShopFilterProps = {
    path: string;
    inputs: ShopFilterInput[];
    className?: string;
};

const Filter: React.FC<ShopFilterProps> = ({ path, inputs, className }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [, transition] = useTransition();

    const form = useForm({
        defaultValues: inputs.reduce(
            (acc, input) => {
                if (input.type === 'date') {
                    if (input.dateKey) {
                        acc[`${input.dateKey[0]}${input.dateKey[1]}`] = [
                            searchParams.get(input.dateKey[0]) || '',
                            searchParams.get(input.dateKey[1]) || (null as unknown as string),
                        ];
                    }
                    return acc;
                }

                acc[input.queryKey] = searchParams.get(input.queryKey) || '';
                return acc;
            },
            {} as Record<string, string | [string, string]>
        ),
    });

    const onSearchQuery = useCallback(
        (query: Record<string, string | null | undefined | [string, string]>) => {
            const params = new URLSearchParams(searchParams.toString());

            inputs.forEach((input) => {
                if (input.type === 'date') {
                    if (input.dateKey) {
                        const [startDate, endDate] = query[`${input.dateKey[0]}${input.dateKey[1]}`] as [
                            string,
                            string,
                        ];
                        if (startDate) {
                            params.set(input.dateKey[0], startDate);
                        } else {
                            params.delete(input.dateKey[0]);
                        }
                        if (endDate) {
                            params.set(input.dateKey[1], endDate);
                        } else {
                            params.delete(input.dateKey[1]);
                        }
                    }
                    return;
                }

                const value = query[input.queryKey];
                if (value) {
                    params.set(input.queryKey, value as string);
                } else {
                    params.delete(input.queryKey);
                }
            });

            transition(() => {
                router.push(`${path}?${params.toString()}`);
            });
        },
        [router, path, searchParams, inputs]
    );

    const delayedQuery = debounce((query: Record<string, string | [string, string]>) => onSearchQuery(query), 300);

    useEffect(() => {
        const subscription = form.watch((value) => {
            delayedQuery(value);
        });
        return () => subscription.unsubscribe();
    }, [form, delayedQuery, onSearchQuery]);

    const resetFilters = () => {
        form.reset();
        const newParams = new URLSearchParams(searchParams.toString());
        inputs.forEach((field) => {
            if (field.type === 'date' && field.dateKey) {
                newParams.delete(field.dateKey[0]);
                newParams.delete(field.dateKey[1]);
                return;
            }

            newParams.delete(field.queryKey);
        });

        transition(() => {
            router.push(`${path}?${newParams.toString()}`);
        });
    };

    return (
        <div className={cn('flex w-full gap-6  overflow-x-auto lg:overflow-visible', className)}>
            <Form {...form}>
                <div className="flex gap-4 ">
                    {inputs.map((input) => (
                        <div key={input.queryKey}>
                            {input.label && <Label htmlFor={input.queryKey}>{input.label}</Label>}
                            {input.type === 'text' && (
                                <Input
                                    className={cn(input.className, 'w-72')}
                                    id={input.queryKey}
                                    placeholder={input.placeholder || `Search by ${input.queryKey}`}
                                    {...form.register(input.queryKey)}
                                />
                            )}
                            {input.type === 'date' && (
                                <FormField
                                    control={form.control}
                                    name={`${input.dateKey?.[0] ?? ''}${input.dateKey?.[1] ?? ''}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            id="date"
                                                            variant={'outline'}
                                                            className={cn(
                                                                'w-72 justify-start text-left font-normal',
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
                                                                <span>
                                                                    {input.placeholder ||
                                                                        `Pick a date for ${input.queryKey}`}
                                                                </span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="range"
                                                            initialFocus
                                                            selected={{
                                                                from: field.value[0]
                                                                    ? new Date(field.value[0])
                                                                    : undefined,
                                                                to: field.value[1]
                                                                    ? new Date(field.value[1])
                                                                    : undefined,
                                                            }}
                                                            defaultMonth={new Date()}
                                                            onSelect={(date) => {
                                                                console.log('startDate', date || '');

                                                                field.onChange([date?.from, date?.to]);
                                                            }}
                                                            numberOfMonths={2}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}
                            {input.type === 'select' && <Select {...form.register(input.queryKey)}></Select>}
                        </div>
                    ))}
                </div>
                <Button onClick={resetFilters}>Clear Filters</Button>
            </Form>
        </div>
    );
};

export default Filter;
