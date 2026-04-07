import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Car, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const AddDriver = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        vehicle_number: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('/drivers', formData);
            navigate('/drivers');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to register driver');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center space-x-4">
               <NavLink to="/drivers" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors dark:text-zinc-400">
                  <ArrowLeft size={20} />
               </NavLink>
               <div>
                  <h2 className="text-3xl font-black tracking-tight dark:text-white transition-colors duration-300">Register Driver</h2>
                  <p className="text-gray-400 font-medium">Onboard a new operator to the platform.</p>
               </div>
            </div>

            <div className="card dark:bg-black dark:border-zinc-800 transition-colors duration-300">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 text-red-700 text-sm rounded font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-zinc-600 uppercase tracking-widest mb-2 px-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-zinc-600 uppercase tracking-widest mb-2 px-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="john@example.com"
                                />
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
                                    placeholder="+91-0000000000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-zinc-600 uppercase tracking-widest mb-2 px-1">Vehicle License Number</label>
                            <div className="relative">
                                <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    name="vehicle_number"
                                    value={formData.vehicle_number}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="e.g. KA-01-HG-1234"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end space-x-4">
                        <NavLink to="/drivers" className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-all">Cancel</NavLink>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary px-10 py-4 flex items-center space-x-2"
                        >
                            <span>{loading ? 'Registering...' : 'Register Driver'}</span>
                            {!loading && <ChevronRight size={18} />}
                        </button>
                    </div>
                </form>
            </div>

            <div className="p-6 bg-black dark:bg-zinc-900 rounded-2xl text-white dark:border dark:border-zinc-800 transition-colors duration-300">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Car size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-lg leading-tight text-white">Platform Ready</p>
                        <p className="text-white/60 text-xs mt-1 font-medium italic">"The driver will receive an automated invitation email once registered."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDriver;
