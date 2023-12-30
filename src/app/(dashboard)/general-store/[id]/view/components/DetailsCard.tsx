import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GeneralStoreItemDetails } from '../page';

type GeneralStoreItemDetailsCardProps = {
    data: NonNullable<GeneralStoreItemDetails>;
};

const GeneralStoreItemDetailsCard: React.FC<GeneralStoreItemDetailsCardProps> = ({ data }) => {
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Details information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2.5">
                <div className="grid grid-cols-12">
                    <p className="col-span-3 text-sm font-medium text-gray-500">Name</p>
                    <p className="col-span-6 text-sm font-medium text-gray-700">{data.name}</p>
                </div>
                <div className="grid grid-cols-12 items-center  ">
                    <p className="col-span-3 text-sm font-medium text-gray-500">Total stock</p>
                    <p className="col-span-6 text-sm font-medium text-gray-700">
                        {data.stockAmount} {data.unitName}
                    </p>
                </div>
                <div className="grid grid-cols-12 items-center  ">
                    <p className="col-span-3 text-sm font-medium text-gray-500">Storage location</p>
                    <p className=" col-span-6 text-sm font-medium capitalize text-gray-700">
                        {data.storageLocation ? data.storageLocation : 'N/A'}
                    </p>
                </div>
                <div className="grid grid-cols-12 items-center  ">
                    <p className="col-span-3 text-sm font-medium text-gray-500">Type</p>
                    <p className=" col-span-6 text-sm font-medium capitalize text-gray-700">{data.type}</p>
                </div>

                <div className="grid grid-cols-12 items-center  ">
                    <p className="col-span-3 text-sm font-medium text-gray-500">Stock amount</p>
                    <p className=" col-span-6 text-sm font-medium capitalize text-gray-700">{data.stockAmount}</p>
                </div>
                <div className="grid grid-cols-12 items-center  ">
                    <p className="col-span-3 text-sm font-medium text-gray-500">Status</p>
                    <p className=" col-span-6 text-sm font-medium capitalize text-gray-700">{data.status}</p>
                </div>
                <div className="grid grid-cols-12 items-center  ">
                    <p className="col-span-3 text-sm font-medium text-gray-500">Financial year</p>
                    <p className="col-span-6 text-sm font-medium capitalize text-gray-700">{data.financialYear.name}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default GeneralStoreItemDetailsCard;
