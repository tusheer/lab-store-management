import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const LoaderSpinner = ({ className = '' }) => {
    return (
        <div className={cn('mt-24 flex flex-col items-center justify-center gap-4', className)}>
            <Loader2 size={70} strokeWidth={1} className="animate-spin text-primary" />
        </div>
    );
};

export default LoaderSpinner;
