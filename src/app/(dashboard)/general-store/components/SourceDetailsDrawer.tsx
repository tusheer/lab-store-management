'use client';

import Container from '@/components/ui/Container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { getUserAvatar } from '@/lib/utils';
import { PurchaseData } from './PurchaseTable.server';

type SourceDetailsDrawerProps = {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    data: PurchaseData[0] | null;
};

const SourceDetailsDrawer: React.FC<SourceDetailsDrawerProps> = ({ isOpen, onClose, data }) => {
    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <Container className="w-full p-0">
                    <DrawerHeader>
                        <DrawerTitle>Source details</DrawerTitle>
                    </DrawerHeader>
                    <div>
                        {data && (
                            <div className="grid min-w-[550px] gap-3.5">
                                <div className="grid grid-cols-12">
                                    <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">Name</p>
                                    <p className="col-span-6  text-sm font-medium text-gray-700">{data.name}</p>
                                </div>

                                <div className="grid grid-cols-12 items-center">
                                    <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">Type</p>
                                    <p className=" col-span-6 text-sm font-medium capitalize text-gray-700">
                                        {data.type}
                                    </p>
                                </div>
                                <div className="grid grid-cols-12 items-center">
                                    <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">Status</p>
                                    <p className=" col-span-6 text-sm font-medium capitalize text-gray-700">
                                        {data.finalQuantity}
                                    </p>
                                </div>
                                <div className="grid grid-cols-12 items-center">
                                    <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">
                                        Financial year
                                    </p>
                                    <p className="col-span-6 text-sm font-medium capitalize text-gray-700">
                                        {data.financialYear.name}
                                    </p>
                                </div>
                                <div className="grid grid-cols-12 items-center">
                                    <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">
                                        Created at
                                    </p>
                                    <p className="col-span-6 text-sm font-medium capitalize text-gray-700">
                                        {new Intl.DateTimeFormat('en-US', {
                                            dateStyle: 'full',
                                        }).format(new Date(data.createdAt))}
                                    </p>
                                </div>
                                <div className="grid grid-cols-12 items-center">
                                    <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">
                                        Last updated at
                                    </p>
                                    <p className="col-span-6 text-sm font-medium capitalize text-gray-700">
                                        {new Intl.DateTimeFormat('en-US', {
                                            dateStyle: 'full',
                                        }).format(new Date(data.updatedAt))}
                                    </p>
                                </div>
                                <div className="grid grid-cols-12 items-center">
                                    <p className="col-span-6 text-sm font-medium text-gray-500 lg:col-span-3">
                                        Last updated by
                                    </p>

                                    <div className="col-span-6 flex  items-center gap-1.5">
                                        <HoverCard>
                                            <HoverCardTrigger>
                                                <Avatar className="h-7 w-7">
                                                    <AvatarImage src={getUserAvatar(data.lastUpdatedBy?.avatar)} />
                                                    <AvatarFallback className="h-7 w-7 text-xs">
                                                        {data.lastUpdatedBy?.name
                                                            ?.split(' ')
                                                            .map((name: string) => name[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </HoverCardTrigger>
                                            <HoverCardContent>
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <Avatar className="h-16 w-16">
                                                        <AvatarImage src={getUserAvatar(data.lastUpdatedBy?.avatar)} />
                                                        <AvatarFallback className="h-16 w-16 text-xs">
                                                            {data.lastUpdatedBy?.name
                                                                ?.split(' ')
                                                                .map((name: string) => name[0])
                                                                .join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col items-center gap-1">
                                                        <h4 className="text-lg font-semibold text-gray-800">
                                                            {data.lastUpdatedBy?.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">
                                                            {data.lastUpdatedBy?.email}
                                                        </p>
                                                        <p className="text-sm text-gray-800">
                                                            <span className="font-semibold">Department: </span>
                                                            {data.lastUpdatedBy?.department}
                                                        </p>
                                                        <p className="text-sm text-gray-800">
                                                            <span className="font-semibold">Designation: </span>
                                                            {data.lastUpdatedBy?.designation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
                                        <p className="text-sm font-medium capitalize text-gray-700">
                                            {data.lastUpdatedBy?.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Container>
            </DrawerContent>
        </Drawer>
    );
};

export default SourceDetailsDrawer;
