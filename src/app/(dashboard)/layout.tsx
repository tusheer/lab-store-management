"use cleint";

import Sidebar from "../components/Sidebar";
const DashboardLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <main className="flex w-full">
            <Sidebar />
            <div className="w-[calc(100%-260px)]">{children}</div>
        </main>
    );
};

export default DashboardLayout;
