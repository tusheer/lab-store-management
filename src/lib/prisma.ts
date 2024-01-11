import { PrismaClient } from '@prisma/client';

// This type definition will help with TypeScript understanding the global object.
type CustomNodeJsGlobal = typeof globalThis & {
    prisma?: PrismaClient;
};

// Declare the global variable
const globalNode = global as CustomNodeJsGlobal;

// Initialize the prisma client with environment-specific settings
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });
} else {
    // In non-production environments
    if (!globalNode.prisma) {
        globalNode.prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
        });
    }
    prisma = globalNode.prisma;
}

export default prisma;
