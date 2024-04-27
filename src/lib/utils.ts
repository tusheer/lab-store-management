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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = (func: (...args: any[]) => void, wait: number): ((...args: any[]) => void) => {
    let timeout: NodeJS.Timeout | null = null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserAvatar = (avatar: any) => {
    if (!avatar) {
        return null;
    }

    return avatar?.url;
};

export function isNotNumber(value: string | number) {
    // Check if the value is not a number or a string that can be converted to a number
    return isNaN(Number(value.toString())) && isNaN(parseFloat(value.toString()));
}

export function toUTCDateString(date: Date) {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth() + 1; // Months are zero-indexed
    const day = d.getUTCDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

export function getSubdomain(url: string) {
    let subdomain = '';
    const match = url.match(/^(?:https?:\/\/)?((?:[\w\d-]+\.)*)?([\w\d-]+\.[\w\d]+)/i);

    if (match && match[1]) {
        subdomain = match[1].slice(0, -1); // Remove the trailing dot
    }

    return subdomain;
}
