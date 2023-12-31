import { cn } from '@/lib/utils';

const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <section className={cn('mx-auto max-w-7xl p-3.5 lg:p-6', className)}>{children}</section>;
};

export default Container;
