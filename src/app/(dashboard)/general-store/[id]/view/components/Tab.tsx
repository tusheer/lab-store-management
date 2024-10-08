'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileMinus, FilePlus, FileSpreadsheet, ScrollText } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { startTransition } from 'react';

interface StoreDetailsTabProps {
    isGeneralStore?: boolean;
}

const StoreDetailsTab: React.FC<StoreDetailsTabProps> = ({ isGeneralStore = false }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();
    const tab = searchParams.get('tab') || 'details';
    const routerPath = isGeneralStore
        ? `/general-store/${params.id}/view`
        : `/shops/${params.id}/${params.itemId}/view`;

    return (
        <Tabs
            onValueChange={(e) => {
                startTransition(() => {
                    router.push(`${routerPath}?tab=${e}`);
                });
            }}
            defaultValue="details"
            className="mt-6 w-full overflow-x-auto"
            value={tab as string}
        >
            <TabsList defaultValue={tab as string} className="inline-flex min-w-[400px]">
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
                <TabsTrigger value="history">
                    <FileMinus size={15} className="mr-1.5" />
                    History
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
};

export default StoreDetailsTab;
