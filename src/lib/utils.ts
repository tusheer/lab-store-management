import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const isRouterPathnameMatched = (pathname: string, routerPath: string, exact: boolean) => {
    if (exact) {
        return pathname === routerPath;
    }

    return isStringInclude(routerPath, pathname);
};

export const isStringInclude = (str: string, matchStr: string): boolean => {
    return str.includes(matchStr);
};

export const snakeCaseToNormalText = (snakeCaseString: string) => {
    const words = snakeCaseString.split('_');
    return words
        .map((word, index) => {
            if (index === 0) {
                // Preserve the case of the first word
                return word.charAt(0) + word.slice(1).toLowerCase();
            } else {
                // Convert other words to lowercase
                return word.toLowerCase();
            }
        })
        .join(' ');
};

export const toSnakeCase = (text: string) => {
    return text
        .trim() // Remove leading and trailing whitespaces
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // Handle camelCase
        .replace(/[\s-]+/g, '_') // Replace spaces and hyphens with underscores
        .toLowerCase(); // Convert all letters to lowercase
};

export const toNormalTextSnakeCase = (str: string) => {
    return str
        .replace(/[\W_]+/g, '_') // Replace all non-word characters and underscores with a single underscore
        .replace(/([a-z])([A-Z])/g, '$1_$2') // Add an underscore before each uppercase letter that is preceded by a lowercase letter
        .toUpperCase();
};

export const numberToCurrency = (number: number) => {
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};



export const getFileType = (filename: string) => {
    if (filename) {
        const fileType = filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
        return fileType === 'jpg' ? 'jpeg' : fileType;
    }
    return null;
};

export const convertToBlob = async (file: File) => {
 
    const encoded = (await readFile(file)) as any;

    const binary = atob(encoded.split(',')[1]);

    const array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    const blobData = new Blob([new Uint8Array(array)], { type: file.type });

    function readFile(file: File) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve) => {
       
            reader.onload = (e: any) => {
                resolve(e.target.result);
            };
        });
    }

    return blobData;
};

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

export const translateEnumToText = (enumValue: string) => {
    if (enumValue) {
        const string = enumValue
            .split('_')
            .filter((v) => v !== '')
            .join(' ');
        return string ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : string;
    }

    return enumValue;
};

export const formatAndConvertToUpperCase = (inputString: string) => {
    const trimmedString = inputString.trim();

    const processedString = trimmedString.replace(/\s+/g, '_');

    const finalString = processedString.toUpperCase();

    return finalString;
};


export function deleteKeysFromObject<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keysToDelete: K[]
): Omit<T, K> {
    keysToDelete.forEach((key) => {
        delete obj[key];
    });

    return obj as Omit<T, K>;
}
