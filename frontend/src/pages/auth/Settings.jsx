import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Wallet, Globe, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-4xl font-black tracking-tight dark:text-white">Account Settings</h2>
                <p className="text-black font-black dark:text-zinc-500 mt-1 uppercase text-[10px] tracking-[0.2em]">Manage your security, notifications, and platform preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="card dark:bg-black dark:border-zinc-800 p-8 space-y-6 flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black mb-6 shadow-xl">
                            <SettingsIcon size={24} />
                        </div>
                        <h3 className="text-xl font-black dark:text-white">Appearance & Theme</h3>
                        <p className="text-sm font-black text-black/50 dark:text-zinc-500 mt-2 uppercase text-[9px] tracking-widest leading-loose">Choose between light and dark modes for a personalized platform experience.</p>
                    </div>
                    <button 
                        onClick={toggleTheme}
                        className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors uppercase tracking-[0.2em] text-[10px]"
                    >
                        Switch to {theme === 'light' ? 'Night Mode' : 'Day Mode'}
                    </button>
                </div>

                <div className="card dark:bg-black dark:border-zinc-800 p-8 space-y-6">
                    <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black mb-6">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black dark:text-white">Email Notifications</h3>
                        <p className="text-sm font-black text-black/50 dark:text-zinc-500 mt-2 uppercase text-[9px] tracking-widest leading-loose">Automated updates for campaign performance and monthly reporting.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" className="w-5 h-5 rounded border-2 border-black dark:border-zinc-800 checked:bg-black dark:checked:bg-white checked:border-black dark:checked:border-white transition-all cursor-pointer" defaultChecked />
                        <span className="text-[10px] font-black uppercase tracking-widest dark:text-zinc-400">Marketing & Performance updates</span>
                    </div>
                </div>

                <div className="card dark:bg-black dark:border-zinc-800 p-8 space-y-6">
                    <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black mb-6">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black dark:text-white">Security & Access</h3>
                        <p className="text-sm font-black text-black/50 dark:text-zinc-500 mt-2 uppercase text-[9px] tracking-widest leading-loose">Manage two-factor authentication and your current account session security.</p>
                    </div>
                    <button className="w-full text-left py-2 text-[10px] font-black uppercase tracking-widest text-red-600 border-b-2 border-transparent hover:border-red-600 transition-all inline-block">Change Password</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
