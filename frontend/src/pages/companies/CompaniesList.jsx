import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Search, Plus, Building2, User, Mail, Phone, Edit2, MoreVertical } from 'lucide-react';
import api from '../../services/api';

const CompaniesList = () => {
    const [companies, setCompanies] = useState([]);
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

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/companies', {
                params: {
                    page: lazyParams.page,
                    limit: lazyParams.rows,
                    search: lazyParams.filters.global.value
                }
            });
            setCompanies(data.companies);
            setTotalRecords(data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching companies', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [lazyParams]);

    const header = (
        <div className="flex items-center justify-between p-4 dark:bg-black transition-colors duration-300">
            <div className="relative w-80">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <InputText 
                    className="w-full !pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none dark:text-white transition-all placeholder:text-gray-400 shadow-sm"
                    placeholder="Search companies..." 
                    onInput={(e) => setLazyParams({ ...lazyParams, filters: { global: { value: e.target.value } } })}
                />
            </div>
            <NavLink to="/companies/new">
                <button className="btn-primary flex items-center space-x-2">
                    <Plus size={18} />
                    <span>Register Company</span>
                </button>
            </NavLink>
        </div>
    );

    const companyTemplate = (rowData) => (
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-zinc-900 flex items-center justify-center border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
                <Building2 size={20} className="text-gray-400" />
            </div>
            <div>
                <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">{rowData.company_name}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-0.5">ID: CMP-{rowData.id}</p>
            </div>
        </div>
    );

    const contactTemplate = (rowData) => (
        <div>
            <p className="font-medium text-sm dark:text-zinc-300 transition-colors duration-300">{rowData.contact_person}</p>
            <p className="text-xs text-gray-400 mt-1">{rowData.email}</p>
        </div>
    );

    const actionsTemplate = (rowData) => (
        <div className="flex items-center justify-end space-x-2">
            <NavLink to={`/companies/edit/${rowData.id}`} className="p-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg text-gray-400 hover:text-black dark:hover:text-white transition-all">
                <Edit2 size={18} />
            </NavLink>
            <button className="p-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg text-gray-400 hover:text-black dark:hover:text-white transition-all">
                <MoreVertical size={18} />
            </button>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black tracking-tight dark:text-white transition-colors duration-300">Companies</h2>
                <p className="text-gray-400 font-medium mt-1">Manage advertising partners and campaigns.</p>
            </div>

            <div className="card !p-0 dark:bg-black dark:border-zinc-800 transition-colors duration-300 overflow-hidden">
                <DataTable 
                    value={companies} 
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
                    <Column field="company_name" header="Company" body={companyTemplate} style={{ minWidth: '18rem' }} />
                    <Column header="Contact Person" body={contactTemplate} />
                    <Column field="phone" header="Phone Number" />
                    <Column field="status" header="Status" />
                    <Column body={actionsTemplate} style={{ textAlign: 'right' }} />
                </DataTable>
            </div>
        </div>
    );
};

export default CompaniesList;
