'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { inActiveFinancialYear } from '../actions';

type ConfirmInactiveFinalcialYearProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    id: number | null;
};

const ConfirmInactiveFinalcialYear: React.FC<ConfirmInactiveFinalcialYearProps> = ({ open, setOpen, id }) => {
    const [confirmationText, setConfirmationText] = useState('');
    const router = useRouter();
    const onSubmit = async () => {
        if (id === null || confirmationText.toLowerCase() !== 'inactive') {
            return;
        }
        try {
            await inActiveFinancialYear(id);
            toast.success('inactive successful');
            router.refresh();
        } catch (error) {
            toast.error('error');
        }

        setOpen(false);
        setConfirmationText('');
    };
    const isButtonDisabled = id === null || confirmationText.toLowerCase() !== 'inactive';
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <div>
                    <h1 className="mb-3 text-xl font-bold">Are you sure to inactive this finalcial year?</h1>
                    <label htmlFor="" className="mb-3 block text-sm font-medium">
                        If you want to inactive you write &quot;inactive&quot; below
                    </label>
                    <input
                        type="text"
                        className="w-full rounded-md border px-3 py-2"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder="Enter code"
                    />
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={onSubmit} disabled={isButtonDisabled}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmInactiveFinalcialYear;
