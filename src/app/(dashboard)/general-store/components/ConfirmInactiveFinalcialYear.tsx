'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';

type ConfirmInactiveFinalcialYearProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    id: number | null;
};

const ConfirmInactiveFinalcialYear: React.FC<ConfirmInactiveFinalcialYearProps> = ({ open, setOpen, id }) => {
    const onSubmit = () => {
        if (id === null) {
            return;
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <div>
                    <h1>Are you sure to inactive this finalcial year?</h1>
                    <label htmlFor="">If you want to inactive you write &quot;inactive&quot; below</label>
                    <input type="text" />
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={onSubmit}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmInactiveFinalcialYear;
