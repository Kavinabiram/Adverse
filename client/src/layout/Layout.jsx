import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import useAuthStore from '../store/authStore';

const Layout = () => {
    const { user } = useAuthStore();

    if (!user || !user.token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto bg-white dark:bg-zinc-900">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
                <footer className="px-8 py-6 text-center text-gray-400 text-xs border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    &copy; {new Date().getFullYear()} ADVERSE Vehicle Advertising Dashboard. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default Layout;
