import ProfileHoverCard from '@/app/components/ProfileHoverCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserAvatar } from '@/lib/utils';
import { GeneralStoreItemDetails } from '../page';

type GeneralStoreItemDetailsCardProps = {
    data: NonNullable<GeneralStoreItemDetails>;
};

const GeneralStoreItemDetailsCard: React.FC<GeneralStoreItemDetailsCardProps> = ({ data }) => {
    return (
        <>
            <Card className="mt-6 overflow-x-auto">
                <CardHeader>
                    <CardTitle>Details information</CardTitle>
                </CardHeader>
                <CardContent className="grid min-w-[400px] gap-3.5">
                    <div className="grid grid-cols-12">
                        <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">Name</p>
                        <p className="col-span-6 text-sm font-medium text-gray-700">{data.name}</p>
                    </div>
                    <div className="grid grid-cols-12 items-center">
                        <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">Total stock</p>
                        <p className="col-span-6 text-sm font-medium text-gray-700">
                            {data.stockAmount} {' ' + data.unitName}
                        </p>
                    </div>
                    <div className="grid grid-cols-12 items-center">
                        <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">Storage location</p>
                        <p className="col-span-6 text-sm font-medium capitalize text-gray-700">
                            {data.storageLocation ? data.storageLocation : 'N/A'}
                        </p>
                    </div>
                    <div className="grid grid-cols-12 items-center">
                        <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">Type</p>
                        <p className="col-span-6 text-sm font-medium capitalize text-gray-700">{data.type}</p>
                    </div>
                    <div className="grid grid-cols-12 items-center">
                        <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">Status</p>
                        <p className="col-span-6 text-sm font-medium capitalize text-gray-700">{data.status}</p>
                    </div>
                    <div className="grid grid-cols-12 items-center">
                        <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">Financial year</p>
                        <p className="col-span-6 text-sm font-medium capitalize text-gray-700">
                            {data.financialYear.name}
                        </p>
                    </div>
                    <div className="grid grid-cols-12 items-center">
                        <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">Created at</p>
                        <p className="col-span-6 text-sm font-medium capitalize text-gray-700">
                            {new Intl.DateTimeFormat('en-US', {
                                dateStyle: 'full',
                            }).format(new Date(data.createdAt))}
                        </p>
                    </div>
                    <div className="grid grid-cols-12 items-center">
                        <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">Last updated at</p>
                        <p className="col-span-6 text-sm font-medium capitalize text-gray-700">
                            {new Intl.DateTimeFormat('en-US', {
                                dateStyle: 'full',
                            }).format(new Date(data.updatedAt))}
                        </p>
                    </div>
                    <div className="grid grid-cols-12 items-center">
                        <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">Last updated by</p>

                        <div className="col-span-6 flex items-center gap-1.5">
                            <ProfileHoverCard user={data.lastUpdatedBy}>
                                <Avatar className="h-7 w-7">
                                    <AvatarImage src={getUserAvatar(data.lastUpdatedBy?.avatar)} />
                                    <AvatarFallback className="h-7 w-7 text-xs">
                                        {data.lastUpdatedBy?.name
                                            ?.split(' ')
                                            .map((name: string) => name[0])
                                            .join('')}
                                    </AvatarFallback>
                                </Avatar>
                            </ProfileHoverCard>
                            <p className="text-sm font-medium capitalize text-gray-700">{data.lastUpdatedBy?.name}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default GeneralStoreItemDetailsCard;
