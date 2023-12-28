'use client';

import { SessionProvider } from 'next-auth/react';

const SessionProviderClient: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export default SessionProviderClient;
