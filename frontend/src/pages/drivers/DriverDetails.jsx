import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Car, Activity, Map, BarChart3 } from 'lucide-react';
import api from '../../services/api';

const DriverDetails = () => {
    const { id } = useParams();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDriver = async () => {
             setLoading(true);
             try {
                const { data } = await api.get(`/drivers/${id}`);
                setDriver(data);
                setLoading(false);
             } catch (error) {
                console.error('Error fetching driver details', error);
                setLoading(false);
             }
        };
        fetchDriver();
    }, [id]);

    if (loading) return <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">Authenticating Profile...</div>;
    if (!driver) return <div className="text-center py-20">Driver not found.</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center space-x-4">
               <NavLink to="/drivers" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft size={20} />
               </NavLink>
               <div>
                  <h2 className="text-3xl font-black tracking-tight">Driver Profile</h2>
                  <p className="text-gray-400 font-medium mt-1">Detailed performance and telemetry.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="card h-fit flex flex-col items-center py-12">
                   <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center font-black text-3xl shadow-xl mb-6">
                       {driver.name[0]}
                   </div>
                   <h3 className="text-2xl font-black mb-1">{driver.name}</h3>
                   <span className="px-3 py-1 bg-green-50 text-green-500 rounded-full text-[10px] uppercase font-black tracking-widest border border-green-100">
                       {driver.status}
                   </span>

                   <div className="w-full mt-12 space-y-6">
                        <div className="flex items-center justify-between px-6">
                            <div className="flex items-center space-x-3">
                                <Mail size={16} className="text-gray-400 dark:text-zinc-400" />
                                <span className="text-sm font-medium text-gray-500">Email</span>
                            </div>
                            <span className="text-sm font-bold dark:text-white">{driver.email}</span>
                        </div>
                        <div className="flex items-center justify-between px-6">
                            <div className="flex items-center space-x-3">
                                <Phone size={16} className="text-gray-400 dark:text-zinc-400" />
                                <span className="text-sm font-medium text-gray-500">Phone</span>
                            </div>
                            <span className="text-sm font-bold dark:text-white">{driver.phone}</span>
                        </div>
                        <div className="flex items-center justify-between px-6">
                            <div className="flex items-center space-x-3">
                                <Car size={16} className="text-gray-400 dark:text-zinc-400" />
                                <span className="text-sm font-medium text-gray-500">Vehicle</span>
                            </div>
                            <span className="text-sm font-bold dark:text-white">{driver.vehicle_number}</span>
                        </div>
                   </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                           { label: 'Total Distance', value: '4,520 KM', icon: <Map size={18} /> },
                           { label: 'Duty Time', value: '184 Hours', icon: <Activity size={18} /> },
                           { label: 'Ad Impressions', value: '25.6K', icon: <BarChart3 size={18} /> },
                        ].map((stat, i) => (
                            <div key={i} className="card dark:bg-black dark:border-zinc-800 transition-all duration-300">
                               <div className="p-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg w-fit mb-4 text-black dark:text-white">
                                  {stat.icon}
                               </div>
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                               <p className="text-2xl font-black mt-2 dark:text-white transition-colors duration-300">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="card">
                       <h4 className="text-lg font-bold mb-8">Ad Playback Statistics</h4>
                       <div className="space-y-6">
                           {[
                               { campaign: 'Mega Sale Ad', plays: '4,520', duration: '15s', cpm: '$2.50' },
                               { campaign: 'Summer Vibes', plays: '2,140', duration: '30s', cpm: '$3.10' },
                               { campaign: 'Green Energy', plays: '840', duration: '20s', cpm: '$2.80' },
                           ].map((item, i) => (
                             <div key={i} className="p-4 border border-gray-100 dark:border-zinc-800 rounded-xl flex items-center justify-between hover:border-black dark:hover:border-white transition-all group">
                                <div className="flex items-center space-x-4">
                                   <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-50 dark:border-zinc-800 text-black dark:text-white flex items-center justify-center shrink-0 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all">
                                     <Activity size={18} />
                                   </div>
                                   <div>
                                     <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300">{item.campaign}</p>
                                     <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{item.duration} Playback</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-sm font-black text-gray-900 dark:text-white transition-colors duration-300">{item.plays}</p>
                                   <p className="text-[10px] text-green-500 font-bold uppercase mt-1">PLAYS</p>
                                </div>
                             </div>
                           ))}
                       </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDetails;
