import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, Building2, User, Mail, Phone, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const AddCompany = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('/companies', formData);
            navigate('/companies');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to register company');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center space-x-4">
               <NavLink to="/companies" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors dark:text-zinc-400">
                  <ArrowLeft size={20} />
               </NavLink>
               <div>
                  <h2 className="text-3xl font-black tracking-tight dark:text-white transition-colors duration-300">Register Partner</h2>
                  <p className="text-gray-400 font-medium">Onboard a new advertising company.</p>
               </div>
            </div>

            <div className="card dark:bg-black dark:border-zinc-800 transition-colors duration-300">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 text-red-700 text-sm rounded font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-zinc-600 uppercase tracking-widest mb-2 px-1">Company Legal Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                required
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                className="input-field pl-10"
                                placeholder="e.g. Acme Advertising Ltd."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-zinc-600 uppercase tracking-widest mb-2 px-1">Contact Person</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    name="contact_person"
                                    value={formData.contact_person}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="e.g. Michael Scott"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-zinc-600 uppercase tracking-widest mb-2 px-1">Official Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="contact@acme.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-zinc-600 uppercase tracking-widest mb-2 px-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-field pl-10"
                                placeholder="+91-888888888"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end space-x-4 transition-colors duration-300">
                        <NavLink to="/companies" className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-all">Cancel</NavLink>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary px-10 py-4 flex items-center space-x-2"
                        >
                            <span>{loading ? 'Registering...' : 'Register Company'}</span>
                            {!loading && <ChevronRight size={18} />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCompany;
