import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ArrowLeft, Activity, User, Building2, PlusSquare, Clock } from 'lucide-react';
import api from '../../services/api';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 20,
        page: 1
    });

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/reports/audit', {
                params: {
                    page: lazyParams.page,
                    limit: lazyParams.rows
                }
            });
            setLogs(data.logs);
            setTotalRecords(data.total);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch audit logs', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [lazyParams]);

    const onPage = (event) => {
        setLazyParams({ ...lazyParams, ...event, page: event.page + 1 });
    };

    const typeTemplate = (rowData) => {
        const icons = {
            'driver': <User size={16} className="text-blue-500" />,
            'ad': <PlusSquare size={16} className="text-green-500" />,
            'company': <Building2 size={16} className="text-purple-500" />
        };
        return (
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-900 flex items-center justify-center border border-gray-100 dark:border-zinc-800">
                    {icons[rowData.type] || <Activity size={16} />}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{rowData.type}</span>
            </div>
        );
    };

    const timeTemplate = (rowData) => {
        const date = new Date(rowData.created_at);
        return (
            <div className="flex items-center space-x-2 text-gray-400">
                <Clock size={14} />
                <span className="text-xs">{date.toLocaleString()}</span>
            </div>
        );
    };

    const actionTemplate = (rowData) => (
        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
            rowData.action === 'registered' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
            rowData.action === 'created' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
        }`}>
            {rowData.action}
        </span>
    );

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex items-center space-x-4">
                <NavLink to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group">
                    <ArrowLeft size={20} className="text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                </NavLink>
                <div>
                    <h2 className="text-3xl font-black tracking-tight dark:text-white">Audit Logs</h2>
                    <p className="text-gray-400 font-medium mt-1">Full history of system mutations and registrations.</p>
                </div>
            </div>

            <div className="card !p-0 dark:bg-black dark:border-zinc-800 transition-colors duration-300 overflow-hidden">
                <DataTable
                    value={logs}
                    lazy
                    paginator
                    first={lazyParams.first}
                    rows={lazyParams.rows}
                    totalRecords={totalRecords}
                    onPage={onPage}
                    loading={loading}
                    className="p-datatable-sm"
                    emptyMessage="No audit logs found."
                >
                    <Column header="Type" body={typeTemplate} style={{ width: '150px' }} />
                    <Column field="title" header="Entity Name" className="font-bold dark:text-white" />
                    <Column header="Action" body={actionTemplate} style={{ width: '120px' }} />
                    <Column header="Timestamp" body={timeTemplate} style={{ width: '200px' }} />
                </DataTable>
            </div>
        </div>
    );
};

export default AuditLogs;
