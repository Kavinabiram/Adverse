import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { User, Phone, Mail, Car, ArrowLeft, Save, Trash2 } from 'lucide-react';
import api from '../../services/api';

const EditDriver = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        vehicle_number: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const { data } = await api.get(`/drivers/${id}`);
                setFormData({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    vehicle_number: data.vehicle_number,
                    status: data.status || 'ACTIVE'
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching driver', error);
                setLoading(false);
            }
        };
        fetchDriver();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/drivers/${id}`, formData);
            navigate('/drivers');
        } catch (error) {
            console.error('Failed to update driver', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to remove this driver permanently?')) {
            try {
                await api.delete(`/drivers/${id}`);
                navigate('/drivers');
            } catch (error) {
                console.error('Failed to delete driver', error);
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">Loading profile for edit...</div>;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <NavLink to="/drivers" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group">
                        <ArrowLeft size={20} className="text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                    </NavLink>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight dark:text-white">Update Profile</h2>
                        <p className="text-gray-400 font-medium mt-1">Modify driver details or credentials.</p>
                    </div>
                </div>
                <button 
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-red-500 border border-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                >
                    <Trash2 size={16} />
                    <span>Terminate ID</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="card dark:bg-black dark:border-zinc-800 space-y-10">
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Full Identity Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                            <input
                                type="text"
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field !pl-12 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 focus:ring-black dark:focus:ring-white transition-all"
                                placeholder="e.g. Johnathan Doe"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <input
                                    type="email"
                                    required
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field !pl-12 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 focus:ring-black dark:focus:ring-white transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Contact Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <input
                                    type="text"
                                    required
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input-field !pl-12 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 focus:ring-black dark:focus:ring-white transition-all"
                                    placeholder="+91 99999999"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Vehicle Registration ID</label>
                            <div className="relative">
                                <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <input
                                    type="text"
                                    required
                                    name="vehicle_number"
                                    value={formData.vehicle_number}
                                    onChange={handleChange}
                                    className="input-field !pl-12 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 focus:ring-black dark:focus:ring-white transition-all"
                                    placeholder="MH-01-XX-1234"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Active Status</label>
                            <select 
                                name="status" 
                                value={formData.status} 
                                onChange={handleChange}
                                className="input-field dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 focus:ring-black dark:focus:ring-white transition-all h-[42px]"
                            >
                                <option value="ACTIVE text-green-500">ACTIVE</option>
                                <option value="INACTIVE text-red-500">INACTIVE</option>
                                <option value="ON-LEAVE text-orange-500">ON-LEAVE</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-end space-x-4">
                    <button 
                        type="button" 
                        onClick={() => navigate('/drivers')}
                        className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        Discard Changes
                    </button>
                    <button 
                        type="submit" 
                        className="btn-primary px-8 py-2.5 flex items-center space-x-2 shadow-2xl relative overflow-hidden group"
                    >
                        <Save size={16} />
                        <span className="font-bold uppercase tracking-widest text-xs">Save Profile</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditDriver;
