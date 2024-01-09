'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileMinus, FilePlus, Package } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const GeneralStoreTab = () => {
    const [, startTrasition] = useTransition();

    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'stock';

    return (
        <Tabs
            onValueChange={(e) => {
                startTrasition(() => {
                    router.push(`/general-store?tab=${e}`);
                });
            }}
            defaultValue={tab as string}
            className="mt-6 w-full overflow-auto"
        >
            <TabsList defaultValue={tab as string} className="inline-flex ">
                <TabsTrigger defaultChecked value="stock" className="text-xs lg:text-sm">
                    <Package size={15} className="mr-1.5" />
                    Stock list
                </TabsTrigger>
                <TabsTrigger value="source" className="text-xs lg:text-sm">
                    <FilePlus size={15} className="mr-1.5" />
                    Source list
                </TabsTrigger>
                <TabsTrigger value="distribution" className="text-xs lg:text-sm">
                    <FileMinus size={15} className="mr-1.5" />
                    Distribution list
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs lg:text-sm">
                    <FileMinus size={15} className="mr-1.5" />
                    History
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
};

export default GeneralStoreTab;
