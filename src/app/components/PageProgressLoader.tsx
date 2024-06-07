'use client';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const PageProgressLoader = () => {
    return <ProgressBar height="2px" color="#0a9b5a" options={{ showSpinner: true }} shallowRouting />;
};

export default PageProgressLoader;
