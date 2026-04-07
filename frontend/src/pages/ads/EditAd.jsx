import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { 
    Activity, 
    ArrowLeft, 
    Calendar, 
    Clock, 
    MapPin, 
    Plus, 
    Tag, 
    Users, 
    Video, 
    Save, 
    Trash2 
} from 'lucide-react';
import api from '../../services/api';

const EditAd = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [contentFile, setContentFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        company_id: '',
        content_type: 'VIDEO',
        duration: 15,
        location_target: '',
        age_target: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const { data } = await api.get(`/ads/${id}`);
                setFormData({
                    title: data.title,
                    company_id: data.company_id,
                    content_type: data.content_type,
                    duration: data.duration,
                    location_target: data.location_target || '',
                    age_target: data.age_target || '',
                    status: data.status || 'ACTIVE'
                });
                if (data.content_url) {
                    setPreviewUrl(`${import.meta.env.VITE_API_BASE_URL.replace('/api','')}${data.content_url}`);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ad', error);
                setLoading(false);
            }
        };
        fetchAd();
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setContentFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (contentFile) data.append('content', contentFile);

            await api.put(`/ads/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/ads');
        } catch (error) {
            console.error('Failed to update ad', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Kill this campaign? This will stop all active playbacks.')) {
            try {
                await api.delete(`/ads/${id}`);
                navigate('/ads');
            } catch (error) {
                console.error('Failed to delete ad', error);
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing campaign data...</div>;

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="card dark:bg-black dark:border-zinc-800 space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Campaign Title</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="input-field !pl-12 font-bold dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
                                        placeholder="e.g. Summer Collection 2026"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Target Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                        <input
                                            type="text"
                                            name="location_target"
                                            value={formData.location_target}
                                            onChange={handleChange}
                                            className="input-field !pl-12 text-sm dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
                                            placeholder="Mumbai, Bangalore"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Age Category</label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                        <input
                                            type="text"
                                            name="age_target"
                                            value={formData.age_target}
                                            onChange={handleChange}
                                            className="input-field !pl-12 text-sm dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
                                            placeholder="18-35, 25-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Playback Duration (Seconds)</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                        <input
                                            type="number"
                                            name="duration"
                                            required
                                            value={formData.duration}
                                            onChange={handleChange}
                                            className="input-field !pl-12 text-sm dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
                                            placeholder="15"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Campaign Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="input-field h-[42px] dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="PAUSED">PAUSED</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-4">
                            <button 
                                type="button" 
                                onClick={() => navigate('/ads')}
                                className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                Cancel Update
                            </button>
                            <button type="submit" className="btn-primary px-10 py-3 flex items-center space-x-2 shadow-2xl">
                                <Save size={18} />
                                <span className="font-bold uppercase tracking-widest text-xs">Update Campaign</span>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="card dark:bg-black dark:border-zinc-800">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Creative Asset</label>
                        <div className="aspect-video bg-gray-50 dark:bg-zinc-900 rounded-xl overflow-hidden mb-6 border-2 border-dashed border-gray-200 dark:border-zinc-800 flex items-center justify-center relative">
                            {previewUrl ? (
                                formData.content_type === 'VIDEO' ? (
                                    <video src={previewUrl} className="w-full h-full object-cover" controls />
                                ) : (
                                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                )
                            ) : (
                                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">No Creative Selected</p>
                            )}
                        </div>
                        <input
                            type="file"
                            id="adFile"
                            className="hidden"
                            accept="video/*,image/*"
                            onChange={handleFileChange}
                        />
                        <button 
                            type="button"
                            onClick={() => document.getElementById('adFile').click()}
                            className="w-full py-4 border-2 border-gray-100 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all text-gray-400 hover:text-black dark:hover:text-white group"
                        >
                            <Video size={24} className="mb-2 transition-transform group-hover:scale-110" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Replace Creative Asset</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAd;
