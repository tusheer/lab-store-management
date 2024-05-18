import { redirectIfNotAllow } from '@/app/action';
import React from 'react';

const GeneralStoreLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
    await redirectIfNotAllow('canViewGeneralStore');
    return <>{children}</>;
};

export default GeneralStoreLayout;
