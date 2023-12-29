import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const generateRandomUid = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
};

export const debounce = (func: (...args: any[]) => void, wait: number): ((...args: any[]) => void) => {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: any[]) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(later, wait);
    };
};

export const isRouterPathnameMatched = (pathname: string, routerPath: string, exact: boolean) => {
    if (exact) {
        return pathname === routerPath;
    }

    return isStringInclude(routerPath, pathname);
};

export const isStringInclude = (str: string, matchStr: string): boolean => {
    return str.includes(matchStr);
};
export const zodStrng = (massage: string) => {
    return z
        .string()
        .refine(
            (value) => {
                if (!value) return true;
                return /^[0-9]+(\.[0-9]+)?$/.test(value);
            },
            {
                message: massage,
            }
        )
        .or(z.number());
};

export const getUserAvatar = (avatar: any) => {
    if (!avatar) {
        return null;
    }

    return avatar?.url;
};
