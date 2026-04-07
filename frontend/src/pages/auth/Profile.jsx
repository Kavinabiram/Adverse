import React from 'react';
import useAuthStore from '../../store/authStore';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const Profile = () => {
    const user = useAuthStore((state) => state.user);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-4xl font-black tracking-tight dark:text-white">Account Profile</h2>
                <p className="text-black font-black dark:text-zinc-500 mt-1 uppercase text-[10px] tracking-[0.2em]">Manage your personal identification and details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="card dark:bg-black dark:border-zinc-800 p-8 flex flex-col items-center text-center">
                    <div className="w-32 h-32 bg-black dark:bg-white rounded-3xl flex items-center justify-center text-white dark:text-black text-5xl font-black shadow-2xl mb-6">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <h3 className="text-2xl font-black dark:text-white">{user?.name}</h3>
                    <p className="text-xs font-black text-black dark:text-zinc-500 uppercase tracking-widest mt-2 bg-gray-50 dark:bg-zinc-900 px-3 py-1 rounded-full border dark:border-zinc-800">{user?.role}</p>
                </div>

                <div className="lg:col-span-2 card dark:bg-black dark:border-zinc-800 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center">
                                <User size={14} className="mr-2" /> Full Name
                            </label>
                            <p className="text-lg font-black dark:text-white border-b-2 dark:border-zinc-800 pb-2">{user?.name}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center">
                                <Mail size={14} className="mr-2" /> Email Address
                            </label>
                            <p className="text-lg font-black dark:text-white border-b-2 dark:border-zinc-800 pb-2">{user?.email}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center">
                                <Shield size={14} className="mr-2" /> Access Role
                            </label>
                            <p className="text-lg font-black dark:text-white border-b-2 dark:border-zinc-800 pb-2">{user?.role}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center">
                                <Calendar size={14} className="mr-2" /> Account Status
                            </label>
                            <p className="text-lg font-black text-green-600 dark:text-green-400 border-b-2 dark:border-zinc-800 pb-2">Verified & Active</p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button className="btn-primary">Update Profile Information</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
