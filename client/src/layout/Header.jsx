import React from 'react';
import { Bell, Search, User, Moon, Sun } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
    const user = useAuthStore((state) => state.user);
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="h-16 bg-white dark:bg-black border-b border-gray-100 dark:border-zinc-900 flex items-center justify-between px-10 sticky top-0 z-50 transition-colors duration-300">
            <div className="flex-1 max-w-xl">
                <div className="flex items-center space-x-3 group">
                    <Search size={18} className="text-gray-300 dark:text-zinc-600 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="Search everything..."
                        className="bg-transparent border-none focus:ring-0 text-sm w-full dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-700 font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-5 ml-8">
                <button 
                    onClick={toggleTheme}
                    className="group relative flex items-center justify-center p-3 hover:bg-black dark:hover:bg-white rounded-2xl transition-all duration-300 shadow-sm"
                    title={theme === 'light' ? 'Enable Night Mode' : 'Enable Day Mode'}
                >
                    {theme === 'light' ? (
                        <Moon size={20} className="text-black group-hover:text-white transition-colors" />
                    ) : (
                        <Sun size={20} className="text-white group-hover:text-black transition-colors" />
                    )}
                </button>

                <button className="p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-all relative group">
                    <Bell size={20} className="text-gray-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-black dark:bg-white rounded-full border-2 border-white dark:border-black"></span>
                </button>

                <div className="h-10 w-[1px] bg-gray-100 dark:bg-zinc-800 mx-2"></div>

                <div className="flex items-center space-x-4 pl-2 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black dark:text-white leading-tight group-hover:text-black/70 dark:group-hover:text-zinc-300 transition-colors">{user?.name || 'Admin User'}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">Terminal Access</p>
                    </div>
                    <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black font-black shadow-lg transition-transform active:scale-95">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
