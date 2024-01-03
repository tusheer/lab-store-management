import { cn } from '@/lib/utils';
import { ChevronRight, HomeIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface BreadcrumbItem {
    name: string;
    path?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

// Breadcrumb Component
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
    return (
        <nav className={cn('font-semibold', className)} aria-label="Breadcrumb">
            <div className="flex items-center space-x-2">
                <HomeIcon size={18} />
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        <ChevronRight size={16} />
                        {item.path ? (
                            <Link href={item.path} className="text-sm text-muted-foreground hover:underline">
                                {item.name}
                            </Link>
                        ) : (
                            <span className="text-sm text-primary">{item.name}</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </nav>
    );
};

export { Breadcrumb };
