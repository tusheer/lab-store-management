'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileMinus, FilePlus, FileSpreadsheet, ScrollText } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { startTransition } from 'react';

const StoreDetailsTab = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();
    const tab = searchParams.get('tab') || 'details';

    return (
        <Tabs
            onValueChange={(e) => {
                startTransition(() => {
                    router.push(`/general-store/${params.id}/view?tab=${e}`);
                });
            }}
            defaultValue="details"
            className="mt-6 w-full overflow-x-auto"
            value={tab as string}
        >
            <TabsList defaultValue={tab as string} className="inline-flex min-w-[550px]">
                <TabsTrigger defaultChecked value="details">
                    <FileSpreadsheet size={15} className="mr-1.5" />
                    Details information
                </TabsTrigger>
                <TabsTrigger value="notes">
                    <ScrollText size={15} className="mr-1.5" />
                    Notes
                </TabsTrigger>

                <TabsTrigger value="source">
                    <FilePlus size={15} className="mr-1.5" />
                    Source list
                </TabsTrigger>
                <TabsTrigger value="distribution">
                    <FileMinus size={15} className="mr-1.5" />
                    Distribution list
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
};

export default StoreDetailsTab;
