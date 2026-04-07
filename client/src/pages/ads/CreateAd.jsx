import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, Film, Image, MapPin, Users, Clock, Upload, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const CreateAd = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({
        company_id: '',
        ad_title: '',
        ad_type: 'Video',
        duration: '',
        location_target: 'Downtown Mumbai',
        age_target: '18-45'
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const { data } = await api.get('/companies', { params: { limit: 100 } });
                setCompanies(data.companies);
            } catch (err) {
                console.error('Failed to fetch companies', err);
            }
        };
        fetchCompanies();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (file) data.append('media', file);

        try {
            await api.post('/ads', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/ads');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create advertisement');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center space-x-4">
               <NavLink to="/ads" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft size={20} />
               </NavLink>
               <div>
                  <h2 className="text-3xl font-black tracking-tight">Create Campaign</h2>
                  <p className="text-gray-400 font-medium">Design and deploy a new advertisement.</p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="card space-y-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Campaign Title</label>
                            <input
                                type="text"
                                required
                                name="ad_title"
                                value={formData.ad_title}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g. Summer Mega Sale 2026"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Company</label>
                                <select
                                    required
                                    name="company_id"
                                    value={formData.company_id}
                                    onChange={handleChange}
                                    className="input-field appearance-none"
                                >
                                    <option value="">Select a company</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>{c.company_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Ad Type</label>
                                <div className="flex p-1 bg-gray-50 rounded-lg">
                                    {['Video', 'Poster'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, ad_type: type })}
                                            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${formData.ad_type === type ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Target Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="location_target"
                                        value={formData.location_target}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="Mumbai, Bangalore"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Age Category</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="age_target"
                                        value={formData.age_target}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="18-35, 25-50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Playback Duration (Seconds)</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    name="duration"
                                    required
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="e.g. 15"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="card">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">Upload Creative Assets</label>
                        <div 
                            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${file ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                hidden
                                onChange={handleFileChange}
                                accept={formData.ad_type === 'Video' ? 'video/*' : 'image/*'}
                            />
                            {file ? (
                                <div className="space-y-2">
                                     <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 scale-in duration-300">
                                         <Upload size={20} />
                                     </div>
                                     <p className="text-sm font-bold truncate px-4">{file.name}</p>
                                     <p className="text-[10px] text-gray-400 uppercase font-black uppercase tracking-tighter">Click to change file</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                     <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                         <Upload size={20} />
                                     </div>
                                     <p className="text-sm font-bold text-gray-700">Drag or Click to Upload</p>
                                     <p className="text-xs text-gray-400">Max file size: 50MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 flex items-center justify-center space-x-2"
                        >
                            <span>{loading ? 'Deploying Campaign...' : 'Launch Campaign'}</span>
                            {!loading && <ChevronRight size={18} />}
                        </button>
                        <NavLink to="/ads" className="block w-full text-center py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all">Cancel</NavLink>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded font-bold">
                            {error}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CreateAd;
