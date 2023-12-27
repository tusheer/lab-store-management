import { GeneralStore } from '../page';
import CreateItemFormModal from './CreateItemForm';

type StockTableProps = {
    data: GeneralStore[];
};

const StockTable: React.FC<StockTableProps> = ({ data }) => {
    return (
        <div>
            <CreateItemFormModal />
            {data.map((d) => {
                return <div key={d.id}>{d.unitName}</div>;
            })}
        </div>
    );
};

export default StockTable;
