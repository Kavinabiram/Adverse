import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { MapPin, Globe, ArrowLeft, Save, Trash2, Crosshair } from 'lucide-react';
import api from '../../services/api';

const EditArea = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        area_name: '',
        latitude: '',
        longitude: '',
        radius: 100, // Optional: for geofencing
    });

    useEffect(() => {
        const fetchArea = async () => {
            try {
                const { data } = await api.get(`/areas/${id}`);
                setFormData({
                    area_name: data.area_name,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    radius: data.radius || 100
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching area', error);
                setLoading(false);
            }
        };
        fetchArea();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/areas/${id}`, formData);
            navigate('/areas');
        } catch (error) {
            console.error('Failed to update area', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Wipe this location record? This will affect analytics mapping.')) {
            try {
                await api.delete(`/areas/${id}`);
                navigate('/areas');
            } catch (error) {
                console.error('Failed to delete area', error);
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">Calibrating area data...</div>;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <NavLink to="/areas" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group">
                        <ArrowLeft size={20} className="text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                    </NavLink>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight dark:text-white">Coordinate Hub</h2>
                        <p className="text-gray-400 font-medium mt-1">Refine geographical boundaries and metadata.</p>
                    </div>
                </div>
                <button 
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-red-500 border border-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                >
                    <Trash2 size={16} />
                    <span>Delete Area</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="card dark:bg-black dark:border-zinc-800 space-y-10">
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Geographic Boundary Name</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                            <input
                                type="text"
                                required
                                name="area_name"
                                value={formData.area_name}
                                onChange={handleChange}
                                className="input-field !pl-12 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
                                placeholder="e.g. Bandra West, Mumbai"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Global Latitude</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <input
                                    type="text"
                                    required
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    className="input-field !pl-12 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
                                    placeholder="18.9212"
                                />
                            </div>
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Global Longitude</label>
                             <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <input
                                    type="text"
                                    required
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    className="input-field !pl-12 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
                                    placeholder="72.8344"
                                />
                             </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-end space-x-4">
                    <button 
                        type="button" 
                        onClick={() => navigate('/areas')}
                        className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        Discard
                    </button>
                    <button 
                        type="submit" 
                        className="btn-primary px-8 py-2.5 flex items-center space-x-2 shadow-2xl"
                    >
                        <Save size={16} />
                        <span className="font-bold uppercase tracking-widest text-xs">Save Coordinates</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditArea;
