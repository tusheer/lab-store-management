'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileMinus, FilePlus, Package } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const GeneralStoreTab = () => {
    const [, startTrasition] = useTransition();

    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    return (
        <Tabs
            onValueChange={(e) => {
                startTrasition(() => {
                    router.push(`/general-store?tab=${e}`);
                });
            }}
            defaultValue="stock"
            className="mt-6 w-full"
        >
            <TabsList defaultValue={tab as string} className="inline-flex">
                <TabsTrigger defaultChecked value="stock">
                    <Package size={15} className="mr-1.5" />
                    Stock list
                </TabsTrigger>
                <TabsTrigger value="purchase">
                    <FilePlus size={15} className="mr-1.5" />
                    Purchase list
                </TabsTrigger>
                <TabsTrigger value="distribution">
                    <FileMinus size={15} className="mr-1.5" />
                    Distribution list
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
};

export default GeneralStoreTab;
