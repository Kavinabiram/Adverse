import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { User, Phone, Mail, Car, Search, Plus, MoreVertical, Edit2, ShieldOff, Eye } from 'lucide-react';
import api from '../../services/api';

const DriversList = () => {
    const [drivers, setDrivers] = useState([]);
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

    const toast = useRef(null);

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/drivers', {
                params: {
                    page: lazyParams.page,
                    limit: lazyParams.rows,
                    search: lazyParams.filters.global.value
                }
            });
            setDrivers(data.drivers);
            setTotalRecords(data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching drivers', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, [lazyParams]);

    const onPage = (event) => {
        setLazyParams({ ...lazyParams, ...event, page: event.page + 1 });
    };

    const onFilter = (event) => {
        setLazyParams({ ...lazyParams, ...event, page: 1 });
    };

    const header = (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 dark:bg-black transition-colors duration-300">
            <div className="relative w-full md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <InputText
                    className="w-full !pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-900 border-none rounded-xl text-xs focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all placeholder:text-gray-400 dark:text-white shadow-sm"
                    placeholder="Search drivers..."
                    onInput={(e) => setLazyParams({ ...lazyParams, filters: { global: { value: e.target.value } } })}
                />
            </div>
            <NavLink to="/drivers/new">
                <button className="btn-primary flex items-center space-x-2 !px-3 !py-1.5 !text-xs">
                    <Plus size={14} />
                    <span>Register Driver</span>
                </button>
            </NavLink>
        </div>
    );

    const nameTemplate = (rowData) => (
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs dark:text-white transition-colors duration-300">
                {rowData.name[0]}
            </div>
            <span className="font-bold dark:text-white transition-colors duration-300">{rowData.name}</span>
        </div>
    );

    const statusTemplate = (rowData) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${rowData.status === 'Active' ? 'bg-green-50 dark:bg-green-900/10 text-green-600' : 'bg-red-50 dark:bg-red-900/10 text-red-600'}`}>
            {rowData.status}
        </span>
    );

    const actionTemplate = (rowData) => (
        <div className="flex items-center space-x-2">
            <NavLink to={`/drivers/${rowData.id}`}>
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg text-gray-400 hover:text-black dark:hover:text-white transition-all">
                    <Eye size={18} />
                </button>
            </NavLink>
            <NavLink to={`/drivers/edit/${rowData.id}`} className="p-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg text-gray-400 hover:text-black dark:hover:text-white transition-all">
                <Edit2 size={18} />
            </NavLink>
            <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-gray-400 hover:text-red-500 transition-all">
                <ShieldOff size={18} />
            </button>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black tracking-tight dark:text-white transition-colors duration-300">Drivers</h2>
                <p className="text-gray-400 font-medium mt-1">Manage and monitor vehicle operators.</p>
            </div>

            <div className="card !p-0 overflow-hidden dark:bg-black dark:border-zinc-800 transition-colors duration-300">
                <DataTable
                    value={drivers}
                    lazy
                    paginator
                    first={lazyParams.first}
                    rows={lazyParams.rows}
                    totalRecords={totalRecords}
                    onPage={onPage}
                    onFilter={onFilter}
                    loading={loading}
                    header={header}
                    responsiveLayout="scroll"
                    className="p-datatable-sm"
                    emptyMessage="No drivers found."
                >
                    <Column field="name" header="Driver Name" body={nameTemplate} sortable style={{ minWidth: '15rem' }} />
                    <Column field="email" header="Email" sortable />
                    <Column field="phone" header="Phone" />
                    <Column field="vehicle_number" header="Vehicle ID" />
                    <Column field="status" header="Status" body={statusTemplate} />
                    <Column body={actionTemplate} exportable={false} style={{ minWidth: '10rem', textAlign: 'right' }} />
                </DataTable>
            </div>
        </div>
    );
};

export default DriversList;
