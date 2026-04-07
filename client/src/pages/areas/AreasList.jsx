import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MapPin, Plus, Search, MoreVertical, ShieldOff } from 'lucide-react';
import api from '../../services/api';

const AreasList = () => {
    const [areas, setAreas] = useState([
        { id: 1, area_name: 'Downtown Mumbai', latitude: 18.9212, longitude: 72.8344, status: 'Active' },
        { id: 2, area_name: 'Electronic City Bangalore', latitude: 12.8399, longitude: 77.6770, status: 'Active' },
        { id: 3, area_name: 'Connaught Place Delhi', latitude: 28.6315, longitude: 77.2167, status: 'Disabled' },
    ]);
    const [loading, setLoading] = useState(false);

    const statusTemplate = (rowData) => (
      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${rowData.status === 'Active' ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500'}`}>
          {rowData.status}
      </span>
    );

    const actionTemplate = (rowData) => (
      <div className="flex items-center justify-end space-x-2">
        <button className="p-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg text-gray-400 hover:text-black dark:hover:text-white transition-all">
          <MoreVertical size={18} />
        </button>
        <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-gray-400 hover:text-red-500 transition-all">
          <ShieldOff size={18} />
        </button>
      </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight dark:text-white transition-colors duration-300">Advertising Areas</h2>
                    <p className="text-gray-400 font-medium mt-1">Manage geographical targeting zones.</p>
                </div>
                <NavLink to="/areas/new">
                    <button className="btn-primary flex items-center space-x-2">
                        <Plus size={18} />
                        <span>Define New Area</span>
                    </button>
                </NavLink>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card !p-0 dark:bg-black dark:border-zinc-800 transition-colors duration-300 overflow-hidden">
                    <DataTable value={areas} className="p-datatable-sm" responsiveLayout="scroll">
                        <Column field="area_name" header="Area Name" body={(row) => (
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-900 flex items-center justify-center transition-colors duration-300">
                                    <MapPin size={16} className="text-gray-400" />
                                </div>
                                <span className="font-bold dark:text-white transition-colors duration-300">{row.area_name}</span>
                            </div>
                        )} />
                        <Column field="latitude" header="Latitude" />
                        <Column field="longitude" header="Longitude" />
                        <Column field="status" header="Status" body={statusTemplate} />
                        <Column body={actionTemplate} />
                    </DataTable>
                </div>

                <div className="card h-full bg-gray-900 dark:bg-black dark:border-zinc-800 text-white relative overflow-hidden transition-colors duration-300">
                    <div className="relative z-10 space-y-6">
                        <h4 className="text-lg font-bold">Zonal Overview</h4>
                        <p className="text-sm text-gray-400">Manage high-precision geofencing for targeted advertising playback.</p>
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Active Zones</span>
                                <span className="text-xl font-black">24</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Disabled Zones</span>
                                <span className="text-xl font-black text-gray-500">2</span>
                            </div>
                            <div className="flex items-center justify-between pb-4">
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Total Area Coverage</span>
                                <span className="text-xl font-black">420km²</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AreasList;
