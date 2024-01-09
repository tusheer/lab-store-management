'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { inActiveFinancialYear } from '../../general-store/actions';

type ConfirmInactiveFinalcialYearProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    id: number | null;
};

const ConfirmInactiveFinalcialYear: React.FC<ConfirmInactiveFinalcialYearProps> = ({ open, setOpen, id }) => {
    const [confirmationText, setConfirmationText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const onSubmit = async () => {
        if (id === null || confirmationText.toLowerCase() !== 'inactive') {
            return;
        }

        try {
            setIsLoading(true);
            await inActiveFinancialYear(id);
            toast.success('inactive successful');
            setIsLoading(false);
            router.refresh();
        } catch (error) {
            setIsLoading(false);
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
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmInactiveFinalcialYear;
