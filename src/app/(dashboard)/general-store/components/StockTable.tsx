import PageHeading from '@/components/ui/PageHeading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { GeneralStore } from '../page';

type StockTableProps = {
    data: NonNullable<GeneralStore>['data'];
};

const StockTable: React.FC<StockTableProps> = ({ data }) => {
    return (
        <div className="mt-10">
            <div className="flex justify-between">
                <PageHeading title="General store" description="Veiw all general store stock item" />
                <Link href="/general-store/new">
                    <Button>Add new item</Button>
                </Link>
            </div>

            <Table className="mt-10">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Unit name</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead>Last updated by</TableHead>
                        <TableHead>Type</TableHead>

                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((d) => (
                        <TableRow key={d.id} className="cursor-pointer">
                            <TableCell>{d.name}</TableCell>
                            <TableCell>{d.unitName}</TableCell>
                            <TableCell>
                                {new Intl.DateTimeFormat('en-US', {
                                    dateStyle: 'medium',
                                }).format(d.createdAt)}
                            </TableCell>
                            {new Intl.DateTimeFormat('en-US', {
                                dateStyle: 'medium',
                            }).format(d.updatedAt)}

                            <TableCell>{d.lastUpdatedBy?.name}</TableCell>
                            <TableCell>{d.type}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default StockTable;
