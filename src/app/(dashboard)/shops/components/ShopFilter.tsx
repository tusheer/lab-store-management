'use client';

import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

const ShopFilter = () => {
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
                router.push(`/shops?${params.toString()}`);
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

    return (
        <>
            <div className="mt-6 flex items-center gap-4">
                <Input
                    className="w-10/12 lg:w-3/12"
                    placeholder="Search by name or department name"
                    {...form.register('search')}
                />
            </div>
        </>
    );
};

export default ShopFilter;
