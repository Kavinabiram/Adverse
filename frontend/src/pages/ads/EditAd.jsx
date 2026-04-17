import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { ArrowLeft, Film, Image as ImageIcon, MapPin, Users, Clock, Save, Trash2, ChevronRight, ImagePlus } from 'lucide-react';
import api from '../../services/api';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ setFormData, formData, setMapModalOpen, setGeocodingLoading }) => {
    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setGeocodingLoading(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
                const data = await response.json();
                const location_name = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                const google_maps_url = `https://www.google.com/maps?q=${lat},${lng}`;
                
                setFormData(prev => ({
                    ...prev,
                    location_name: location_name,
                    location_lat: lat,
                    location_lng: lng,
                    google_maps_url: google_maps_url
                }));
                setTimeout(() => setMapModalOpen(false), 500);
            } catch (err) {
                console.error("Geocoding failed", err);
            } finally {
                setGeocodingLoading(false);
            }
        },
    });

    return formData.location_lat && formData.location_lng ? (
        <Marker position={[formData.location_lat, formData.location_lng]}></Marker>
    ) : null;
};

const EditAd = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Video',
        duration_seconds: '',
        location_name: '',
        location_lat: null,
        location_lng: null,
        google_maps_url: '',
        age_target: '18-45',
        status: 'active',
        file_url: '',
        thumbnail_url: ''
    });

    // Map UI States
    const [mapModalOpen, setMapModalOpen] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const { data } = await api.get(`/ads/${id}`);
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    type: data.type || 'Video',
                    duration_seconds: data.duration_seconds || 0,
                    location_name: data.location_name || '',
                    location_lat: data.location_lat ? parseFloat(data.location_lat) : null,
                    location_lng: data.location_lng ? parseFloat(data.location_lng) : null,
                    google_maps_url: data.google_maps_url || '',
                    age_target: data.age_target || '18-45',
                    status: data.status || 'active',
                    file_url: data.file_url || '',
                    thumbnail_url: data.thumbnail_url || ''
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching ad', err);
                setError('Failed to load advertisement data');
                setLoading(false);
            }
        };
        fetchAd();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.put(`/ads/${id}`, {
                ...formData,
                duration_seconds: parseInt(formData.duration_seconds) || 0
            });
            navigate('/ads');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update advertisement');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Kill this campaign? This will stop all active playbacks.')) {
            try {
                await api.delete(`/ads/${id}`);
                navigate('/ads');
            } catch (err) {
                console.error('Failed to delete ad', err);
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Accessing campaign data...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <NavLink to="/ads" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group">
                        <ArrowLeft size={20} className="text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                    </NavLink>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight dark:text-white">Campaign Studio</h2>
                        <p className="text-gray-400 font-medium mt-1">Refine assets, targeting, and playback parameters.</p>
                    </div>
                </div>
                <button 
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-red-500 border border-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                >
                    <Trash2 size={16} />
                    <span>Stop Campaign</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="card space-y-8 dark:bg-black dark:border-zinc-800">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Campaign Title</label>
                            <input
                                type="text"
                                required
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field dark:bg-zinc-900 border-none"
                                placeholder="e.g. Summer Mega Sale 2026"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="input-field dark:bg-zinc-900 border-none min-h-[100px] resize-y"
                                placeholder="Campaign overview and key objectives..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Ad Type</label>
                                <div className="flex p-1 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                                    {['Video', 'Poster'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            disabled
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all opacity-70 ${formData.type === type ? 'bg-white dark:bg-zinc-800 shadow text-black dark:text-white' : 'text-gray-400'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="input-field appearance-none dark:bg-zinc-900 border-none"
                                >
                                    <option value="active">ACTIVE</option>
                                    <option value="inactive">INACTIVE</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-50 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Target Location</label>
                                <div className="flex space-x-2">
                                    <div className="relative flex-1">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                        <input
                                            type="text"
                                            name="location_name"
                                            value={formData.location_name}
                                            onChange={handleChange}
                                            className="input-field !pl-12 text-sm dark:bg-zinc-900 border-none truncate"
                                            placeholder="Select location using map..."
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => setMapModalOpen(true)}
                                        className="btn-secondary !px-4 !py-2 text-xs font-bold shrink-0 bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white rounded-xl transition-all"
                                    >
                                        Map
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Age Category</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                    <input
                                        type="text"
                                        name="age_target"
                                        value={formData.age_target}
                                        onChange={handleChange}
                                        className="input-field !pl-12 text-sm dark:bg-zinc-900 border-none"
                                        placeholder="18-35, 25-50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Playback Duration (Seconds)</label>
                            <div className="relative w-1/2">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <input
                                    type="number"
                                    name="duration_seconds"
                                    required
                                    value={formData.duration_seconds}
                                    onChange={handleChange}
                                    className="input-field !pl-12 text-sm dark:bg-zinc-900 border-none"
                                    placeholder="e.g. 15"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="card dark:bg-black dark:border-zinc-800">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">Active Assets</label>
                        <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 bg-black aspect-video flex items-center justify-center">
                            {formData.type === 'Video' ? (
                                <video src={formData.file_url} controls className="w-full h-full object-contain" />
                            ) : (
                                <img src={formData.file_url} className="w-full h-full object-contain" alt="Poster" />
                            )}
                        </div>
                        
                        {formData.thumbnail_url && formData.type === 'Video' && (
                            <div className="mt-6 border-t border-gray-100 dark:border-zinc-800 pt-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Thumbnail Preview</label>
                                <div className="rounded-lg overflow-hidden border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 aspect-video">
                                    <img src={formData.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            <Save size={18} />
                            <span>{loading ? 'Sycing Changes...' : 'Save Updates'}</span>
                        </button>
                        <NavLink to="/ads" className="block w-full text-center py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-all">Cancel Edits</NavLink>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs rounded-r font-bold">
                            {error}
                        </div>
                    )}
                </div>
            </form>

            {mapModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col border border-gray-100 dark:border-zinc-800">
                        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-black">
                            <h3 className="text-lg font-black dark:text-white tracking-tight">Relocate Node Coordinate</h3>
                            <button 
                                type="button" 
                                onClick={() => setMapModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-black dark:text-white transition-all text-xs font-bold"
                            >
                                Dismiss Map
                            </button>
                        </div>
                        {isGeocoding && (
                            <div className="w-full bg-blue-500 text-white text-xs text-center py-1.5 font-bold uppercase tracking-widest animate-pulse">
                                Re-associating Location Descriptor...
                            </div>
                        )}
                        <div className="h-[65vh] w-full relative z-0">
                            <MapContainer center={[formData.location_lat || 19.0760, formData.location_lng || 72.8777]} zoom={11} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationMarker setFormData={setFormData} formData={formData} setMapModalOpen={setMapModalOpen} setGeocodingLoading={setIsGeocoding} />
                            </MapContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditAd;
