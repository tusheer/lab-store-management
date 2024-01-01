import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import SessionProviderClient from './(dashboard)/SessionProvider.client';
import PageProgressLoader from './components/PageProgressLoader';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Comilla polytechnic institute',
    description: 'Comilla polytechnic institute',
    icons: {
        icon: [
            {
                url: '/favicon.png',
            },
        ],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <SessionProviderClient>
                    <PageProgressLoader />
                    {children}
                </SessionProviderClient>
            </body>
            <Toaster position="bottom-right" />
        </html>
    );
}
