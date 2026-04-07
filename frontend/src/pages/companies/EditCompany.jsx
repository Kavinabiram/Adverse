import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { Building2, User, Mail, Phone, ArrowLeft, Save, Trash2, Globe } from 'lucide-react';
import api from '../../services/api';

const EditCompany = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        website: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const { data } = await api.get(`/companies/${id}`);
                setFormData({
                    company_name: data.company_name,
                    contact_person: data.contact_person,
                    email: data.email,
                    phone: data.phone,
                    website: data.website || '',
                    status: data.status || 'ACTIVE'
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching company', error);
                setLoading(false);
            }
        };
        fetchCompany();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/companies/${id}`, formData);
            navigate('/companies');
        } catch (error) {
            console.error('Failed to update company', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Delete this partner and all associated data?')) {
            try {
                await api.delete(`/companies/${id}`);
                navigate('/companies');
            } catch (error) {
                console.error('Failed to delete company', error);
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">Loading partner data...</div>;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <NavLink to="/companies" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group">
                        <ArrowLeft size={20} className="text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                    </NavLink>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight dark:text-white">Partner Management</h2>
                        <p className="text-gray-400 font-medium mt-1">Update legal and contact details for this account.</p>
                    </div>
                </div>
                <button 
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-red-500 border border-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                >
                    <Trash2 size={16} />
                    <span>Deactivate Account</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="card dark:bg-black dark:border-zinc-800 space-y-10">
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Company Legal Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                            <input
                                type="text"
                                required
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                className="input-field !pl-12 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
                                placeholder="e.g. Acme Advertising Ltd."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Primary Contact Person</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <input
                                    type="text"
                                    required
                                    name="contact_person"
                                    value={formData.contact_person}
                                    onChange={handleChange}
                                    className="input-field !pl-12 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
                                    placeholder="e.g. Michael Scott"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Official Website</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="input-field !pl-12 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
                                    placeholder="https://acme.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Official Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <input
                                    type="email"
                                    required
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field !pl-12 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
                                    placeholder="contact@acme.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <input
                                    type="text"
                                    required
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input-field !pl-12 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
                                    placeholder="+91-888888888"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-end space-x-4">
                    <button 
                        type="button" 
                        onClick={() => navigate('/companies')}
                        className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        Discard Changes
                    </button>
                    <button 
                        type="submit" 
                        className="btn-primary px-8 py-2.5 flex items-center space-x-2 shadow-2xl transition-all"
                    >
                        <Save size={16} />
                        <span className="font-bold uppercase tracking-widest text-xs">Commit Updates</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCompany;
