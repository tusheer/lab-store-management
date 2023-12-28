import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GeneralStore } from '../page';
import CreateItemFormModal from './CreateItemForm';

type StockTableProps = {
    data: GeneralStore[];
};

const StockTable: React.FC<StockTableProps> = ({ data }) => {
    return (
        <div>
            <CreateItemFormModal />

            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>Unit name</TableHead>
                        <TableHead>Brand Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Purchased At</TableHead>
                        <TableHead> Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>warranty Expire Date</TableHead>
                        <TableHead>Warranty Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Intend number</TableHead>
                        <TableHead>cash Memo No</TableHead>
                        <TableHead>Cash Memo Date</TableHead>
                        <TableHead>Alert when stock amount is less than</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>seller Information</TableHead>

                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        {data.map((d) => {
                            return (
                                <>
                                    <TableCell key={d.id} className="font-medium">
                                        {d.name}
                                    </TableCell>
                                    <TableCell key={d.id} className="font-medium">
                                        {d.unitName}
                                    </TableCell>
                                </>
                            );
                        })}
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

export default StockTable;
