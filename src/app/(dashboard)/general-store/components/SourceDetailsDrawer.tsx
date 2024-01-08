'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { PurchaseData } from './PurchaseTable.server';

type SourceDetailsDrawerProps = {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    data: PurchaseData[0];
};

const SourceDetailsDrawer: React.FC<SourceDetailsDrawerProps> = ({ isOpen, onClose, data }) => {
    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Source details</DrawerTitle>
                </DrawerHeader>
                <div>lorem upis</div>
            </DrawerContent>
        </Drawer>
    );
};

export default SourceDetailsDrawer;
