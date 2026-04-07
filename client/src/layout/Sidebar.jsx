import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  PlusSquare, 
  MapPin, 
  BarChart3, 
  LogOut,
  Car
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = () => {
    const logout = useAuthStore((state) => state.logout);

    return (
        <aside className="sidebar bg-white dark:bg-black border-r border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="p-10">
                <h1 className="text-3xl font-black tracking-tighter text-black dark:text-white leading-none">ADVERSE</h1>
                <p className="text-[10px] font-black text-black dark:text-zinc-500 tracking-[0.2em] mt-2">ADMIN PANEL</p>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
                <p className="px-6 text-[10px] font-black text-black dark:text-zinc-500 uppercase tracking-widest mb-4">Core Fleet</p>
                <NavLink to="/" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : 'text-black hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white'}`}>
                    <LayoutDashboard size={20} className="mr-3 text-black dark:text-gray-400" />
                    <span className="font-bold">Overview</span>
                </NavLink>
                <NavLink to="/drivers" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : 'text-black hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white'}`}>
                    <Users size={20} className="mr-3 text-black dark:text-gray-400" />
                    <span className="font-bold">Drivers</span>
                </NavLink>
                <NavLink to="/areas" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : 'text-black hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white'}`}>
                    <MapPin size={20} className="mr-3 text-black dark:text-gray-400" />
                    <span className="font-bold">Hot Zones</span>
                </NavLink>

                <div className="pt-8 mb-4">
                    <p className="px-6 text-[10px] font-black text-black dark:text-zinc-500 uppercase tracking-widest mb-4">Business</p>
                    <NavLink to="/companies" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : 'text-black hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white'}`}>
                        <Building2 size={20} className="mr-3 text-black dark:text-gray-400" />
                        <span className="font-bold">Ad Partners</span>
                    </NavLink>
                    <NavLink to="/ads" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : 'text-black hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white'}`}>
                        <PlusSquare size={20} className="mr-3 text-black dark:text-gray-400" />
                        <span className="font-bold">Campaigns</span>
                    </NavLink>
                    <NavLink to="/reports" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : 'text-black hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white'}`}>
                        <BarChart3 size={20} className="mr-3 text-black dark:text-gray-400" />
                        <span className="font-bold">Intelligence</span>
                    </NavLink>
                </div>
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
                <button 
                    onClick={logout}
                    className="flex items-center w-full px-6 py-3 text-sm font-black text-black dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 rounded-xl transition-all"
                >
                    <LogOut size={20} className="mr-3" />
                    <span>Secure Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
