import React, { useEffect, useState, useRef } from 'react';
import { Bell, Search, User, Moon, Sun, Settings, LogOut, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
    const user = useAuthStore((state) => state.user);
    const setProfile = useAuthStore((state) => state.setProfile);
    const logout = useAuthStore((state) => state.logout);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        setProfile();
        
        // Click outside to close menu
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setProfile]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white dark:bg-black border-b border-gray-100 dark:border-zinc-900 flex items-center justify-between px-10 sticky top-0 z-50 transition-colors duration-300">
            <div className="flex-1 max-w-xl">
                <div className="flex items-center space-x-3 group">
                    <Search size={18} className="text-gray-400 dark:text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
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

                <div className="relative" ref={menuRef}>
                    <div 
                        className="flex items-center space-x-4 pl-2 cursor-pointer group"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black dark:text-white leading-tight group-hover:text-black/70 dark:group-hover:text-zinc-300 transition-colors uppercase tracking-tight">{user?.name || 'Admin User'}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">Terminal Access</p>
                        </div>
                        <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black font-black shadow-lg transition-transform group-hover:scale-105 active:scale-95 duration-200">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                    </div>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-4 w-60 bg-white dark:bg-black border-2 border-black dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 border-b dark:border-zinc-800">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Signed in as</p>
                                <p className="text-xs font-black dark:text-white truncate">{user?.email}</p>
                            </div>
                            <div className="p-2">
                                <Link 
                                    to="/profile" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center space-x-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-black dark:text-zinc-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-xl transition-all"
                                >
                                    <UserCircle size={16} />
                                    <span>My Profile</span>
                                </Link>
                                <Link 
                                    to="/settings" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center space-x-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-black dark:text-zinc-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-xl transition-all"
                                >
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </Link>
                            </div>
                            <div className="p-2 border-t dark:border-zinc-800">
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center space-x-3 w-full px-4 py-3 text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                >
                                    <LogOut size={16} />
                                    <span>Secure Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
