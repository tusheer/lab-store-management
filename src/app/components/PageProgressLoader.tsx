'use client';
import { Next13ProgressBar } from 'next13-progressbar';

const PageProgressLoader = () => {
    return <Next13ProgressBar height="2px" color="#0a9b5a" options={{ showSpinner: true }} showOnShallow />;
};

export default PageProgressLoader;
