import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Search, Plus, Play, Pause, Trash2, Edit2, Film, Image, MapPin, Users } from 'lucide-react';
import api from '../../services/api';

const AdsList = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
        filters: {
            'global': { value: '', matchMode: 'contains' }
        }
    });

    const fetchAds = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/ads', {
                params: {
                    page: lazyParams.page,
                    limit: lazyParams.rows,
                    search: lazyParams.filters.global.value
                }
            });
            setAds(data.ads);
            setTotalRecords(data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching ads', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, [lazyParams]);

    const header = (
        <div className="flex items-center justify-between p-4 dark:bg-black transition-colors duration-300">
            <div className="relative w-80">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <InputText
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-900 border-none rounded-lg text-sm focus:ring-1 focus:ring-black dark:focus:ring-white outline-none dark:text-white transition-colors duration-300"
                    placeholder="Search advertisements..."
                    onInput={(e) => setLazyParams({ ...lazyParams, filters: { global: { value: e.target.value } } })}
                />
            </div>
            <NavLink to="/ads/new">
                <button className="btn-primary flex items-center space-x-2">
                    <Plus size={18} />
                    <span>Create Advertisement</span>
                </button>
            </NavLink>
        </div>
    );

    const titleTemplate = (rowData) => (
        <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg bg-black dark:bg-zinc-800 flex items-center justify-center overflow-hidden border dark:border-zinc-700 transition-colors duration-300">
                {rowData.ad_type === 'Video' ? <Film size={20} className="text-white" /> : <Image size={20} className="text-white" />}
            </div>
            <div>
                <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">{rowData.ad_title}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{rowData.company_name}</p>
            </div>
        </div>
    );

    const targetingTemplate = (rowData) => (
        <div className="flex items-center space-x-4">
            <div className="flex items-center text-xs text-gray-500 dark:text-zinc-500 transition-colors duration-300">
                <MapPin size={14} className="mr-1.5" />
                {rowData.location_target}
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-zinc-500 transition-colors duration-300">
                <Users size={14} className="mr-1.5" />
                {rowData.age_target}
            </div>
        </div>
    );

    const statusTemplate = (rowData) => (
        <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${rowData.status === 'Active' ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-zinc-700'}`}></span>
            <span className="text-xs font-bold dark:text-white transition-colors duration-300">{rowData.status}</span>
        </div>
    );

    const actionTemplate = (rowData) => (
        <div className="flex items-center justify-end space-x-1">
            <button className="p-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg text-gray-400 hover:text-black dark:hover:text-white transition-all">
                <Edit2 size={16} />
            </button>
            <button className="p-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-lg text-gray-400 dark:text-zinc-500 transition-all">
                {rowData.status === 'Active' ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 rounded-lg text-gray-400 transition-all">
                <Trash2 size={16} />
            </button>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black tracking-tight dark:text-white transition-colors duration-300">Advertisements</h2>
                <p className="text-gray-400 font-medium mt-1">Design, monitor, and distribute campaigns.</p>
            </div>

            <div className="card !p-0 dark:bg-black dark:border-zinc-800 transition-colors duration-300 overflow-hidden">
                <DataTable
                    value={ads}
                    lazy
                    paginator
                    first={lazyParams.first}
                    rows={lazyParams.rows}
                    totalRecords={totalRecords}
                    onPage={(e) => setLazyParams({ ...lazyParams, ...e, page: e.page + 1 })}
                    onFilter={(e) => setLazyParams({ ...lazyParams, ...e, page: 1 })}
                    loading={loading}
                    header={header}
                    className="p-datatable-sm"
                    responsiveLayout="scroll"
                >
                    <Column header="Campaign" body={titleTemplate} style={{ minWidth: '20rem' }} />
                    <Column field="ad_type" header="Type" />
                    <Column header="Targeting" body={targetingTemplate} />
                    <Column field="duration" header="Duration (s)" />
                    <Column field="status" header="Status" body={statusTemplate} />
                    <Column body={actionTemplate} style={{ textAlign: 'right' }} />
                </DataTable>
            </div>
        </div>
    );
};

export default AdsList;
