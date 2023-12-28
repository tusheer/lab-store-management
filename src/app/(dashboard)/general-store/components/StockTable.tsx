import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GeneralStore } from '../page';

type StockTableProps = {
    data: NonNullable<GeneralStore>['data'];
};

const StockTable: React.FC<StockTableProps> = ({ data }) => {
    return (
        <Container>
            <div className="flex justify-between">
                <PageHeading title="General store" description="Veiw all general store stock item" />
                <Link href="/general-store/new">
                    <Button>Add new item</Button>
                </Link>
            </div>

            {data.map((d) => {
                return <div key={d.id}>{d.name}</div>;
            })}
        </Container>
    );
};

export default StockTable;
