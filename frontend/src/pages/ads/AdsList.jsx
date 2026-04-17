import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Search, Plus, Play, Pause, Trash2, Edit2, Film, Image, MapPin } from 'lucide-react';
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
        const timer = setTimeout(() => {
            fetchAds();
        }, 300);
        return () => clearTimeout(timer);
    }, [lazyParams]);

    const toggleStatus = async (rowData) => {
        try {
            const newStatus = (rowData.status || 'active').toLowerCase() === 'active' ? 'inactive' : 'active';
            await api.put(`/ads/${rowData.id}`, { ...rowData, status: newStatus });
            fetchAds();
        } catch (error) {
            console.error('Failed to toggle status', error);
        }
    };

    const handleDelete = async (rowData) => {
        if (window.confirm('Are you sure you want to permanently delete this advertisement?')) {
            try {
                await api.delete(`/ads/${rowData.id}`);
                fetchAds();
            } catch (error) {
                console.error('Failed to delete ad', error);
            }
        }
    };

    const header = (
        <div className="flex items-center justify-between p-4 dark:bg-black transition-colors duration-300">
            <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <InputText
                    className="w-full !pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-900 border-none rounded-xl text-xs focus:ring-2 focus:ring-black dark:focus:ring-white outline-none dark:text-white transition-all placeholder:text-gray-400 shadow-sm"
                    placeholder="Search advertisements..."
                    onInput={(e) => setLazyParams({ ...lazyParams, filters: { global: { value: e.target.value } } })}
                />
            </div>
            <NavLink to="/ads/new">
                <button className="btn-primary flex items-center space-x-2 !px-3 !py-1.5 !text-xs">
                    <Plus size={14} />
                    <span>Create Advertisement</span>
                </button>
            </NavLink>
        </div>
    );

    const titleTemplate = (rowData) => (
        <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg bg-black dark:bg-zinc-800 flex items-center justify-center overflow-hidden border dark:border-zinc-700 transition-colors duration-300">
                {rowData.thumbnail_url ? (
                    <img src={rowData.thumbnail_url} alt="thumbnail" className="w-full h-full object-cover" />
                ) : (
                    rowData.type === 'Video' ? <Film size={20} className="text-white" /> : <Image size={20} className="text-white" />
                )}
            </div>
            <div>
                <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">{rowData.title || 'Untitled'}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{rowData.company_name || 'No Company'}</p>
            </div>
        </div>
    );

    const targetingTemplate = (rowData) => (
        <div className="flex flex-col gap-1">
            <div className="flex items-center text-xs font-semibold text-gray-500 dark:text-zinc-400 transition-colors duration-300">
                <MapPin size={12} className="mr-1.5" />
                {rowData.location_name || 'N/A'}
            </div>
        </div>
    );

    const statusTemplate = (rowData) => {
        const isActive = (rowData.status || 'active').toLowerCase() === 'active';
        return (
            <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {rowData.status || 'Active'}
            </span>
        );
    };

    const actionTemplate = (rowData) => {
        const isActive = (rowData.status || 'active').toLowerCase() === 'active';
        return (
            <div className="flex items-center justify-end space-x-1">
                <NavLink to={`/ads/edit/${rowData.id}`} className="p-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg text-gray-400 hover:text-black dark:hover:text-white transition-all">
                    <Edit2 size={18} />
                </NavLink>
                <button 
                    onClick={() => toggleStatus(rowData)}
                    title={isActive ? 'Deactivate' : 'Activate'}
                    className="p-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-lg text-gray-400 dark:text-zinc-500 transition-all"
                >
                    {isActive ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button 
                    onClick={() => handleDelete(rowData)}
                    title="Delete"
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 rounded-lg text-gray-400 transition-all"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black tracking-tight dark:text-white transition-colors duration-300">Advertisements</h2>
                <p className="text-gray-400 font-medium mt-1">Design, monitor, and distribute campaigns.</p>
            </div>

            <div className="card !p-0 dark:bg-black dark:border-zinc-800 transition-colors duration-300">
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
                    <Column field="type" header="Type" />
                    <Column header="Targeting" body={targetingTemplate} />
                    <Column field="duration_seconds" header="Duration (s)" />
                    <Column field="status" header="Status" body={statusTemplate} />
                    <Column body={actionTemplate} style={{ textAlign: 'right' }} />
                </DataTable>
            </div>
        </div>
    );
};

export default AdsList;
